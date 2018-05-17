const ContextualAirspacePlugin = require('../src/index.js').default
const AIRMAP_API_KEY = localStorage.getItem('AIRMAP_API_KEY')
const MAPBOX_ACCESS_TOKEN = localStorage.getItem('MAPBOX_ACCESS_TOKEN')

if (AIRMAP_API_KEY && MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
    
    const standard = 'mapbox://styles/airmap/cipg7gw9u000jbam53kwpal1q'
    const light = 'mapbox://styles/airmap/ciprepvql000xbbnn8anxyb19'
    const dark = 'mapbox://styles/airmap/ciprerhe7000vbfnj3luzf2g6'
    const satellite = 'mapbox://styles/airmap/ciprk6y7b001qekm7sjrh9f9v'

    const map = new mapboxgl.Map({
        container: 'map',
        style: light,
        // Santa Monica
        center: [-118.496475, 34.024212],
        zoom: 13
    })
    const config = {
        "airmap": {
            "api_key": AIRMAP_API_KEY
        },
        "auth0": {
            "client_id": "",
            "callback_url": ""
        },
        "mapbox": {
            "access_token": MAPBOX_ACCESS_TOKEN
        }
    }
    const options = {
        preferredRulesets: [
            'usa_part_107',
            'deu_rules_waiver'
        ],
        overrideRulesets: [
            // 'usa_part_107'
        ],
        enableRecommendedRulesets: true,
        theme: 'light',
        // Specific options for development purposes only
        baseJurisdictionSourceUrl: localStorage.getItem('BASE_JURISDICTION_SOURCE_URL'),
        mapStylesUrl: localStorage.getItem('MAP_STYLES_URL'),
        mapStylesVersion: localStorage.getItem('MAP_STYLES_VERSION'),
        rulesetSourceUrl: localStorage.getItem('RULESET_SOURCE_URL'),
        ruleApiUrl: localStorage.getItem('RULE_API_URL'),
    }
    const plugin = new ContextualAirspacePlugin(config, options);
    map.addControl(plugin, 'top-left')

    // Example for how ruleset changes are surfaced to the consuming application.
    plugin.on('jurisdictionChange', (data) => console.log('jurisdictionChange', data))
    plugin.on('airspaceLayerClick', (data) => console.log('airspaceLayerClick', data))

    setTimeout(() => {
        console.log({
            jurisdictions: plugin.getJurisdictions(),
            selectedRulelsets: plugin.getSelectedRulesets()
        })
    }, 5000)
} else {
    console.error(
        'Missing AIRMAP_API_KEY or MAPBOX_ACCESS_TOKEN. ' +
        'These are required for developing locally.\n\n' +
        'Please save these values in localStorage by entering the following in your browser console:\n\n' +
        'localStorage.setItem(\'AIRMAP_API_KEY\', \'<your_key>\');\n' +
        'localStorage.setItem(\'MAPBOX_ACCESS_TOKEN\', \'<your_token>\');\n\n'
    );
}
