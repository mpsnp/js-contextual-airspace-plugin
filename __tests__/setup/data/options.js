module.exports = {
    options: {
        baseJurisdictionSourceUrl: null,
        enableRecommendedRulesets: false,
        mapStylesUrl: null,
        mapStylesVersion: null,
        overrideRulesets: null,
        preferredRulesets: null,
        rulesetSourceUrl: null,
        ruleApiUrl: null,
        theme: null
    },
    mergedOptionsObject: {
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
}