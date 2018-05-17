import {
    debounce,
    get,
    find,
    findLastIndex,
    keyBy,
    uniqBy,
    differenceBy,
    toNumber,
    toString
} from 'lodash';
import * as turfBboxPolygon from '@turf/bbox-polygon';
import * as turfBbox from '@turf/bbox';
import fetchMapStyles from './utilities/styles'
import { BadConfigError, BadOptionWarn } from './utilities/error.js';
import {
    didJurisdictionsChange,
    getBaseJurisdictionLayer,
    getClickedGeometry,
    getDefaultSelectedRulesets,
    getOptions,
    getOverridenRulesets,
    getSourceUrl,
    getTimeFilter,
    isArrayOfStrings,
    isThemeSupported,
    organizeJurisdictionRulesetsByType
} from './utilities';
import events from './utilities/events'
import { colors } from './constants';

/**
 * Class that parses our Ruleset data and constructs a UI for interacting with that data.
 */

export default class ContextualAirspace {

    get defaults() {
        return this.constructor.defaults
    }

    constructor(config, options) {
        this.map = null
        this.el = null
        this.isPluginLoaded = false
        this.baseJurisdictionSourceLoaded = false
        this.onClick = () => {}
        this.styles = {
            classifiedLayers: [],
            unclassifiedLayers: []
        }
        
        this.apiKey = get(config, 'airmap.api_key', null)
        this.options = getOptions(this.defaults, options)
        
        if (!this.apiKey) throw new BadConfigError('api_key')
        
        this.jurisdictions = []
        this.selectedRulesets = []
        this.preferredRulesets = this.options.preferredRulesets
        this.theme = this.options.theme
        this.setTheme(this.theme)
    }

    onAdd = map => {
        this.map = map
        this.requestStyles()
        if (this.map.loaded()) this.mapSetup()
        else this.map.on('load', () => this.mapSetup())
        

        this.el = document.createElement('div')
        this.el.className = 'mapboxgl-ctrl-airmap-rules mapboxgl-ctrl'
        this.el.id = 'root-rules-plugin'
        return this.el
    }

    requestStyles = () => {
        fetchMapStyles(`${this.options.mapStylesUrl}/${this.options.mapStylesVersion}/${this.options.theme}.json`)
        .then(this.stylesResolver)
        .catch(err => console.log(err))
    }

    stylesResolver = ({ classifiedLayers, unclassifiedLayers }) => {
        this.styles.classifiedLayers = classifiedLayers
        this.styles.unclassifiedLayers = unclassifiedLayers
    }

    /**
    * Removes the control from the map it has been added to. This is called by `map.removeControl`,
    * which is the recommended method to remove controls.
    * @returns {Rules} - `this`
    */
    onRemove = map => {
        this.el.parentNode.removeChild(this.el)
        this.styles = {
            classifiedLayers: [],
            unclassifiedLayers: []
        }
        this.map.off('click', this.handleMapClick)
        this.map.off('moveend', this.handleMapUserActionEnd)
        events.unsubscribe('ruleset-change', this.handleUserRulesetChange)
        this.baseJurisdictionSourceLoaded = false
        this.map = map
        this.isPluginLoaded = false

        return this
    }

    /**
    * Sets up UI, the initial source for rulesets, gets the location data, and binds the event listeners.
    * @private
    */
    mapSetup = () => {
        this.setupBaseJurisdictionSource()
        this.map.on('click', e => this.handleMapClick(e))
        // Handle map user action - (drag, pan, or zoom end)
        // handleMapUserActionEnd parses new jurisdiction data and handles adding/removing layers
        this.map.on('moveend', debounce(this.handleMapUserActionEnd, 700, { 'trailing': true }))
        this.isPluginLoaded = true
    }

        /**
    * Sets up the base source for rulesets.
    * @private
    */
   setupBaseJurisdictionSource = () => {
        this.map.addLayer(getBaseJurisdictionLayer(this.options.baseJurisdictionSourceUrl), 'background')
        this.map.on('sourcedata', data => {
            if (data.isSourceLoaded && data.sourceId === 'jurisdictions' && !this.baseJurisdictionSourceLoaded) {
                // preferredRulesets - pass in as options to the plugin
                this.receiveJurisdictions(this.options.preferredRulesets)
                this.baseJurisdictionSourceLoaded = true
            }
        })
    }

    /**
    * Private method that returns a deduped list of jurisdictions from the base source.
    * @returns {Array} - A list of deduped jurisdictions found when querying the map.
    * @private
    */
    getJurisdictionsFromMap = () => {
        const layers = this.map.queryRenderedFeatures()
        const lastIndex = findLastIndex(layers, feature => feature.layer.source === 'composite')
        let jurisdictions = layers.slice(lastIndex)
        jurisdictions = jurisdictions
            .filter(feature => feature.layer.source === 'jurisdictions' && feature.properties.jurisdiction)
            .map(feature => JSON.parse(feature.properties.jurisdiction))
            .filter(jurisdiction => !!jurisdiction.rulesets.length)
        return uniqBy(jurisdictions, 'id')
    }

    /**
    * Method that takes a list of preferred rulesets, queries the map for new
    * jurisdictions and updates the state of the class with the state of jurisdictions
    * and default selected rulesets. Additionally, map layers are updated here and
    * after determining the state of our selected rulesets, we request accompanying advisories.
    * This method is called when the plugin first loads, and when the map finishes zooming or panning.
    * @private
    */
    receiveJurisdictions = preferredRulesets => {
        
        // Return early if map is still moving
        if (this.map.isMoving()) return
        
        // Get jurisdictions from map tiles
        let jurisdictions = this.getJurisdictionsFromMap()
        if (!jurisdictions.length) {
            return this.handleNoJurisdictions()
        }
        // Check if jurisdictions changed before doing the work to parse them - return early if no change on the map
        if (this.jurisdictions.length) {
            if (!didJurisdictionsChange(this.jurisdictions, jurisdictions)) return
        }
        
        if (this.options.overrideRulesets && this.options.overrideRulesets.length) {
            return this.handleOverrideRulesets(jurisdictions)
        }

        // Array of Retrieved Jurisdictions with rulesets organized by type
        const parsedJurisdictionRulesets = organizeJurisdictionRulesetsByType(jurisdictions)

        // Gathers the default selected rulesets: required, pick1 defaults, and optional if selected by user previously
        let defaultSelectedRulesets = getDefaultSelectedRulesets(parsedJurisdictionRulesets, preferredRulesets, null, this.options.enableRecommendedRulesets)

        // Handles the adding and removing of sources/layers to and from the map.
        if (!this.selectedRulesets.length) {
            /*
                If selectedRulesets is empty, the plugin is loading,
                so we'll add the preferredRulesets to the map.
            */
            defaultSelectedRulesets.forEach(ruleset => this.addRuleset(ruleset))
        } else {
            /*
                If selectedRulesets is not empty, we find the differences (to remove) and remove those.
                We can send the rest of the rulesets to be added as we'll be checking if ruleset source already
                exists before adding it.
            */
            let rulesetsToRemove = differenceBy(this.selectedRulesets, defaultSelectedRulesets, 'id')
            rulesetsToRemove.forEach(ruleset => this.removeRuleset(ruleset))
            defaultSelectedRulesets.forEach(ruleset => this.addRuleset(ruleset))
        }

        this.jurisdictions = parsedJurisdictionRulesets;
        this.selectedRulesets = defaultSelectedRulesets;
        events.fire('jurisdictionChange', {
            jurisdictions: parsedJurisdictionRulesets,
            selectedRulesets: defaultSelectedRulesets
        })
    }

    handleOverrideRulesets = jurisdictions => {
        let rulesetsToAdd = getOverridenRulesets(jurisdictions, this.options.overrideRulesets)
        rulesetsToAdd.forEach(ruleset => this.addRuleset(ruleset))
    }

    /**
    * Called when the 'moveend' map event fires.
    * @private
    */
    handleMapUserActionEnd = () => {
        this.receiveJurisdictions(this.preferredRulesets)
    }

    /**
    * Called when no jurisdictions are found on the map. Likely a zoom level issue.
    * @private
    */
    handleNoJurisdictions = () => {
        this.jurisdictions = [];
        this.selectedRulesets = [];
    }

    /**
    * Subscribe to events that happen within the plugin.
    * @param {string} type - Name of event. Available events and the data passed into their respective event objects are:
    * - __some-event.load__ `{} Array of objects containing data
    * - __some-event.click__ `{} Array of objects containing data
    * @param {Function} fn - Function that's called when the event is emitted
    * @returns {Rules} - `this`
    * @private
    */
    on = (type, fn) => {
        events.subscribe(type, fn)
        return this
    }

    /**
    * Remove an event
    * @param {string} type - Event name.
    * @param {Function} fn - Function that should unsubscribe to the event emitted.
    * @returns {Rules} - `this`
    * @private
    */
    off = (type, fn) => {
        events.unsubscribe(type, fn)
        return this
    }

    /**
    * Takes a ruleset as a parameter and adds a new source if one doesn't already
    * exist and adds its corresponding layers. If the source already exists, we
    * add the layers style definition.
    * @param {Object} ruleset - Ruleset object with a ruleset id and layer metadata used
    * for building the source and layers.
    * @private
    */
    addRuleset = ruleset => {
        // Catches any rulesets with null ids
        if (!ruleset.id) return

        // Catches any rulesets without layers
        if (!ruleset.layers[0].length) return

        // Catches any sources that already exists and won't add them to the map
        let source = this.map.getSource(ruleset.id)
        if (source) return
        
        this.map.addSource(ruleset.id, {
            type: 'vector',
            tiles: [ getSourceUrl(this.options.rulesetSourceUrl, ruleset.id, ruleset.layers.join(), this.apiKey) ],
            "minzoom": 6,
            "maxzoom": 12
        })
        ruleset.layers.forEach(classification => {
            let layersToAdd = [];
            if (classification !== 'non_geo') {
                this.styles.classifiedLayers.forEach((layer, index) => {
                    if (layer.id.split('|')[1] === classification) {
                        layersToAdd.push(layer)
                    }
                })
                if (!layersToAdd.length) {
                    this.styles.unclassifiedLayers.forEach((base_layer, index) => {
                        this.addLayer(ruleset.id, classification, base_layer)
                    })
                } else {
                    layersToAdd.forEach((base_layer, index) => {
                        this.addLayer(ruleset.id, classification, base_layer)
                    })
                }
            }
        })
    }

    /**
    * Takes a rulesetId and layer, finds it's corresponding style object, clones it, and adds the layer to the map.
    * @param {string} rulesetId - Ruleset ID
    * @param {string} layer - Layer Name
    * @private
    */
    addLayer = (rulesetId, classification, base_layer) => {
        let layer = { ...base_layer }
        const before = layer.before
        delete layer.before

        if (base_layer.id.indexOf('unclassified') > 0) {
            layer.id = layer.id.replace('unclassified', classification)
        }

        if (!this.map.getLayer(`${layer.id}|${rulesetId}`)) {
            layer = {
                ...layer,
                "id": `${layer.id}|${rulesetId}`,
                "source": rulesetId,
                "source-layer": `${rulesetId}_${classification}`
            }
            if (classification === 'tfr' || classification === 'notam') {
                layer.filter = getTimeFilter(4, 'hours')
            }
            if (classification === 'heliport' && layer.type === 'symbol') {
                layer.minzoom = 11
            }
            this.map.addLayer(layer, before)
        }
    }

    /**
    * Takes a ruleset as a parameter and removes the layers corresponding to the
    * ruleset source and then removes the source.
    * @param {Object} ruleset - Ruleset object with a ruleset id and layer metadata used
    * for removing the source and layers.
    * @private
    */
    removeRuleset = ruleset => {
        let source = this.map.getSource(ruleset.id)
        if (source) {
            this.map.getStyle().layers.forEach(layer => {
                if (layer.source === ruleset.id) this.map.removeLayer(layer.id)
            })
            this.map.removeSource(ruleset.id)
        }
    }

    /**
    * Called whenever a user clicks on the map.
    * This method will filter for airmap layers (advisories) and if found, will highlight the top-most layer's border yellow.
    * If no layer is found during the filter and an advisory is in a selected state, then we'll dismiss and remove the highlight on the layer.
    * @private
    */
    handleMapClick = data => {
        const features = data.target.queryRenderedFeatures(data.point)
                            .filter(f => f.layer.id.indexOf('airmap') > -1 && f.properties.id)
        if (features.length) {
            events.fire(
                'airspaceLayerClick',
                {
                    layers: features
                }
            )
        }
    }

    /**
    * Returns a Boolean indicating whether the plugin is fully loaded.
    * Returns false if the plugin is not yet fully loaded.
    * @returns {Boolean} - true if the plugin is fully loaded, false if otherwise
    * @public
    */
    get loaded() {
        return this.isPluginLoaded
    }

    /**
    * Returns a Boolean indicating whether the plugin is fully loaded.
    * Returns false if the plugin is not yet fully loaded.
    * @returns {Boolean} - true if the plugin is fully loaded, false if otherwise
    * @public
    */
   getJurisdictions = () => {
        return this.jurisdictions;
    }

    /**
    * Returns a Boolean indicating whether the plugin is fully loaded.
    * Returns false if the plugin is not yet fully loaded.
    * @returns {Boolean} - true if the plugin is fully loaded, false if otherwise
    * @public
    */
   getSelectedRulesets = () => {
        return this.selectedRulesets;
    }

    /**
    * Sets the theme.
    * @param {string} [theme] - base map theme, sets airspace layers accordingly.
    * @returns {Rules} - `this`
    * @public
    */
    setTheme = (theme = null) => {
        if (!theme || !isThemeSupported(theme)) {
            BadOptionWarn("theme - defaulting to 'light'.")
            if (this.theme !== 'light') {
                this.requestStyles();
            }
            this.theme = 'light'
        } else {
            this.theme = theme
            this.requestStyles();
        }
        return this
    }

}

ContextualAirspace.defaults = {
    baseJurisdictionSourceUrl: 'https://api.airmap.com/tiledata/v1/base-jurisdiction/{z}/{x}/{y}',
    enableRecommendedRulesets: false,
    mapStylesUrl: 'https://cdn.airmap.com/static/map-styles',
    mapStylesVersion: '0.8.5',
    overrideRulesets: null,
    preferredRulesets: null,
    rulesetSourceUrl: 'https://api.airmap.com/tiledata/v1',
    ruleApiUrl: 'https://api.airmap.com/rules/v1/rule',
    theme: 'light'
}
