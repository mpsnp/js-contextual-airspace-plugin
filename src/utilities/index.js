import {
    get,
    intersectionWith,
    mergeWith
} from 'lodash'
import {
    supportedThemes
} from '../constants'
import moment from 'moment'

/**
* Merges defaults with options if option values are not null.
* @param {Object} defaults - Constructor defaults.
* @param {Object} options - Consuming application options.
* @returns {Object} - Merged object with non-null values
* @private
*/
export const getOptions = (defaults, options) => {
    const opts = mergeWith({}, options, defaults, (objVal, srcVal) => objVal ? objVal : srcVal)
    return {
        ...defaults,
        ...opts
    }
}

/**
* Returns the filter needed to present TFRs on the map.
* Current implementation displays TFRs if their active time
* falls within the next four hours of the client's time or if the TFR is permanent.
* @param {number} Time you want to add.
* @param {string} The amount of time you want to add. See https://momentjs.com/docs/#/manipulating/add/ for more info.
* @returns {Array} - Filters as required by Mapbox https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter
* @private
*/
export function getTimeFilter(time = 4, amount = 'hours') {
    const inFourHours = moment().add(time, amount).unix()
    const now = moment().unix()
    return [
            'any',
            [
                'all',
                ['<=', 'start', inFourHours],
                ['>=', 'end', now]
            ],
            [
                'all',
                ['>=', 'start', now],
                ['<=', 'end', inFourHours]
            ],
            [
                'all',
                ['<=', 'start', inFourHours],
                ['!has', 'end']
            ],
            [
                'all',
                ['!has', 'end'],
                ['!has', 'base']
            ],
            ['==', 'permanent', true]
        ]
}

/**
* Checks whether a theme is a supported base theme for the map.
* @param  {string} theme - base theme.
* @return {Boolean} True if theme is supported, false if otherwise.
*/
export function isThemeSupported(theme) {
    if (!theme || supportedThemes.indexOf(theme) < 0) return false
    return true
}

/**
* Takes in an array and validates whether it is an array of strings.
* @param  {Array} An array of strings or an array of other data types.
* @return {Boolean} True if array is an array of strings, false otherwise.
*/
export function isArrayOfStrings(array) {
    let check = true
    if (!Array.isArray(array) || !array.length) return false
    array.forEach(el => {
        if (typeof el !== 'string') check = false
    })
    return check
}

/**
* Returns a Mapbox style layer based on the AirMap Base Jurisdiction vector source.
* @return {Object} Object conforming to the Mapbox Style Spec for layers.
*/
export function getBaseJurisdictionLayer(baseJurisdictionSourceUrl) {
    return {
        "id": "jurisdictions",
        "type": "fill",
        "source": {
            type: 'vector',
            tiles: [ baseJurisdictionSourceUrl ],
            "minzoom": 6,
            "maxzoom": 12
        },
        "source-layer": "jurisdictions",
        "minZoom": 6,
        "maxZoom": 22
    }
}

/**
 * @typedef {Object.<Array>} JurisdictionsWithRulesetsOrganizedByType
 * @property {Array} required Rulesets that are required
 * @property {Array} pick1 Rulesets that are classified as Pick One rulesets
 * @property {Array} optional Rulesets that are optional
 */

/**
 * @typedef {Array.<Object>} JurisdictionsWithoutRulesetsNotOrganizedByType
 */

 /**
 * Returns an array of Jurisdiction objects with a transformed ruleset property
 * that is now an object keyed by type of ruleset (required, pick1, or optional)
 * @param  {JurisdictionsWithoutRulesetsNotOrganizedByType}
 *         A list of deduped jurisdiction objects.
 * @return {JurisdictionsWithRulesetsOrganizedByType}
 *         Array of Jurisdiction objects with a ruleset object keyed by ruleset type.
 */
export const organizeJurisdictionRulesetsByType = jurisdictions => {
    console.log('organizeJurisdictionRulesetsByType', jurisdictions);
    return jurisdictions.map(jurisdiction => ({
        ...jurisdiction,
        rulesets: exports.parseRulesets(jurisdiction.rulesets, jurisdiction.region, jurisdiction.id)
    }))
}

/**
 * @typedef {Object.<Object>} JurisdictionsOrganizedByRegion
 * @property {Object} Jurisdiction Region (jurisdiction level) - federal, state, county, city, local.
 */

/**
 * @typedef {Object.<Array>} JurisdictionsNotOrganizedByRegion
 */

 /**
 * Returns an array of Jurisdiction objects with a transformed ruleset property
 * that is now an object keyed by type of ruleset (required, pick1, or optional).
 * @param  {JurisdictionsNotOrganizedByRegion}
 *         A list of deduped jurisdiction objects.
 * @return {JurisdictionsOrganizedByRegion}
 *         Object of Jurisdiction objects keyed by the region (jurisdiction level).
 */
export const organizeJurisdictionsByRegion = (jurisdictions) => {
    let jurisdictionLevel = {}
    jurisdictions.forEach(jurisdiction => {
        if (!jurisdictionLevel[jurisdiction.region]) {
            jurisdictionLevel[jurisdiction.region] = [ jurisdiction ]
        } else {
            jurisdictionLevel[jurisdiction.region].push(jurisdiction)
        }
    })
    return jurisdictionLevel
}

/**
 * @typedef {Object.<Array>} RulesetOrganizedByType
 * @property {Array} required Rulesets that are required.
 * @property {Array} pick1 Rulesets that are classified as Pick One rulesets.
 * @property {Array} optional Rulesets that are optional.
 */

/**
 * @typedef {Array.<Object>} RulesetNotOrganizedByType
 */

 /**
 * Takes in an array of rulesets and returns one ruleset object keyed by type of ruleset
 * (required, pick1, or optional) which are arrays.
 * @param  {RulesetNotOrganizedByType}
 *         A list of ruleset objects.
 * @return {RulesetOrganizedByType}
 *         Ruleset object keyed by ruleset type (required, pick1, optional).
 */
export const parseRulesets = (ruleset, region, jurisdiction) => {
    let required = [], pick1 = [], optional = []
    /*
        Adding region_id and jurisdiction_id to ruleset to
        prevent a deep search when a user deselects a pick1.
        Additionally, we use the region_id and jurisdiction_id
        as a way to navigate to the origin of the ruleset when
        a user clicks on it via the MissionTags list.
        See 'removeRuleset' in actions for more info or MissionTags
        in src/views/MissionTags.
    */
    ruleset.forEach(r => {
        switch (r.selection_type) {
            case 'required':
                required.push({ ...r, region, jurisdiction })
                break;
            case 'pick1':
                pick1.push({ ...r, region, jurisdiction })
                break;
            case 'optional':
                optional.push({ ...r, region, jurisdiction })
                break;
            default:
                optional.push({ ...r, region, jurisdiction })
        }
    })
    return { required, pick1, optional }
}

/**
* Takes in an array of jurisdictions and returns the id of the first region (jurisdiction level) found with rulesets.
* @param  {Array} A list of jurisdictions objects.
* @return {string} Jurisdiction id.
*/
export function selectInitialRegion(jurisdictions) {
    for (let key in jurisdictions) {
        if (jurisdictions[key].length) return key
    }
    return ''
}

export function getOverridenRulesets(jurisdictions, overrideRulesets) {
    let rulesetsToAdd = [];
    let rulesetsToRemove = [];
    jurisdictions.forEach(jurisdiction => {
        jurisdiction.rulesets.forEach(ruleset => {
            if (overrideRulesets.indexOf(ruleset.id) > -1) {
                rulesetsToAdd.push(ruleset)
            }
        });
    });
    return rulesetsToAdd;
}

/**
* Takes in an array of jurisdictions whose rulesets is an array of objects keyed by type
* and returns an array of defaultSelectedRulesets (objects).
* @param  {Object.<Array>} A list of jurisdictions objects.
* @param  {Array.<string>} A list of preferred ruleset ids.
* @return {Array.<Object>} A list of preferred rulesets as objects.
*/
export function getDefaultSelectedRulesets(jurisdictions, preferredRulesets = null, disabledRulesets = null, enableRecommendedRulesets = false) {
    // Use helper parsing functions to get rulesets
    let required_rulesets = exports.getRequiredRulesets(jurisdictions)
    let pick1_rulesets = exports.getPickOneRulesets(jurisdictions, preferredRulesets)
    let optional_rulesets = exports.getOptionalRulesets(jurisdictions, preferredRulesets, disabledRulesets, enableRecommendedRulesets)

    let selected_rulesets = pick1_rulesets.concat(optional_rulesets, required_rulesets)
    return selected_rulesets
}

/**
* Takes in an array of jurisdictions whose rulesets is an array of objects keyed by type
* and returns an array of the required rulesets.
* @param  {Object.<Array>} A list of jurisdictions objects.
* @return {Array.<Object>} A list of required rulesets.
*/
export function getRequiredRulesets(jurisdictions) {
    let required_rulesets = []
    jurisdictions.forEach(jurisdiction => {
        required_rulesets = required_rulesets.concat(jurisdiction.rulesets.required)
    })
    return required_rulesets
}

/**
* Takes in an array of jurisdictions whose rulesets is an array of objects keyed by type
* and returns an array of the pick1 rulesets to be added as defaultSelectedRulesets.
* This parser will compare the preferred rulesets provided to it against those available
* in the jurisdictions currently available on the map. If found, it will return those to
* be added to the list of defaultSelectedRulesets. If no preferred rulesets are used,
* it will find the default pick1 ruleset or if non is provided, then it will select the
* first pick1 ruleset in the list and return those to be added to the list
* of defaultSelectedRulesets.
* @param  {Object.<Array>} A list of jurisdictions objects.
* @param  {Array.<string>} A list of preferred ruleset ids.
* @return {Array.<Object>} A list of pick1 rulesets to
* be added to the list of defaultSelectedRulesets.
*/
export function getPickOneRulesets(jurisdictions, preferredRulesets) {
    const pick1_rulesets = []
    jurisdictions.forEach(jurisdiction => {
        if (preferredRulesets) {
            if (jurisdiction.rulesets.pick1.length) {
                let pick1Preference = intersectionWith(jurisdiction.rulesets.pick1, preferredRulesets, (arrVal, otherVal) => {
                    return arrVal.id === otherVal
                })
                if (pick1Preference.length) {
                    pick1_rulesets.push(pick1Preference[0])
                } else {
                    let defaultPick1Ruleset = null
                    jurisdiction.rulesets.pick1.forEach(ruleset => {
                        if (ruleset.default === true) defaultPick1Ruleset = ruleset
                    })
                    if (!defaultPick1Ruleset) {
                        defaultPick1Ruleset = jurisdiction.rulesets.pick1[0]
                    }
                    pick1_rulesets.push(defaultPick1Ruleset)
                }
            }
        } else {
            if (jurisdiction.rulesets.pick1.length) {
                let defaultPick1Ruleset = null
                jurisdiction.rulesets.pick1.forEach(ruleset => {
                    if (ruleset.default === true) defaultPick1Ruleset = ruleset
                })
                if (!defaultPick1Ruleset) {
                    defaultPick1Ruleset = jurisdiction.rulesets.pick1[0]
                }
                pick1_rulesets.push(defaultPick1Ruleset)
            }
        }
    })
    return pick1_rulesets
}

/**
* Takes in an array of jurisdictions whose rulesets is an array of objects keyed by type
* and returns an array of the optional rulesets to be added as defaultSelectedRulesets.
* This parser will compare the preferred rulesets provided to it against those available
* in the jurisdictions currently available on the map. If found, it will return those to
* be added to the list of defaultSelectedRulesets. We also automatically include any
* AirMap recommended rulesets.
* @param  {Object.<Array>} A list of jurisdictions objects.
* @param  {Array.<string>} A list of preferred ruleset ids.
* @return {Array.<Object>} A list of optional rulesets to
* be added to the list of defaultSelectedRulesets.
*/
export function getOptionalRulesets (jurisdictions, preferredRulesets, disabledRulesets, enableRecommendedRulesets) {
    const optional_rulesets = []
    const disabled = disabledRulesets || []
    jurisdictions.forEach(jurisdiction => {
        if (jurisdiction.rulesets.optional.length) {
            jurisdiction.rulesets.optional.forEach(ruleset => {
                /*
                 * We include optional rulesets when a user has preselected an
                 * optional ruleset or the ruleset is an AirMap recommended ruleset.
                 */
                if (enableRecommendedRulesets) {
                    optional_rulesets.push(ruleset)
                } else if (preferredRulesets && preferredRulesets.indexOf(ruleset.id) > -1 && ruleset.id.indexOf('airmap') < 0) {
                    optional_rulesets.push(ruleset)
                } else if (ruleset.default && disabled.indexOf(ruleset.id) < 0) {
                    optional_rulesets.push(ruleset)
                }
            })
        }
    })
    return optional_rulesets
}

/**
* Takes in a ruleset id, categories (csv), an apiKey, and constructs a tile source url.
* @param  {string} rulesetId Ruleset Id.
* @param  {string} categories Comma separated list of layers.
* @param  {string} apiKey AirMap API Key to request the tile source.
* @return {string} Tile source url.
*/
export function getSourceUrl(rulesetSourceUrl, rulesetId, categories, apiKey) {
    return `${rulesetSourceUrl}/${rulesetId}/${categories}/{z}/{x}/{y}?apikey=${apiKey}`
}

export function didJurisdictionsChange(original, incoming) {
    let jurisdictionMap = {};
    original.forEach(o => jurisdictionMap[o.uuid] = true);
    for (let i = 0; i < incoming.length; i++) {
        if (!jurisdictionMap[incoming[i].uuid]) {
            return true;
        }
    }
    return false;
}