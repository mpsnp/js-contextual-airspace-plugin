export const defaultOptions = {
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

export const config = {
    "airmap": {
        "api_key": 'AIRMAP_API_KEY'
    },
    "auth0": {
        "client_id": "",
        "callback_url": ""
    },
    "mapbox": {
        "access_token": 'MAPBOX_ACCESS_TOKEN'
    }
}