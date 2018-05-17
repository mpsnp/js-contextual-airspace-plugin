const {
    getOptions,
    getTimeFilter,
    isThemeSupported,
    isArrayOfStrings,
    getBaseJurisdictionLayer,
    organizeJurisdictionRulesetsByType,
    organizeJurisdictionsByRegion,
    parseRulesets,
    selectInitialRegion,
    getOverridenRulesets,
    getDefaultSelectedRulesets,
    getRequiredRulesets,
    getPickOneRulesets,
    getOptionalRulesets,
    getSourceUrl,
    didJurisdictionsChange
} = require('src/utilities')

const {
    jurisdictionOrganizedByRegion,
    jurisdictionRulesetsOrganizedByType,
    rawJurisdictionData,
    rulesetsList_required,
    rulesetsList_pick1_preferred,
    rulesetsList_pick1_no_preferred,
    options,
    mergedOptionsObject,
    optionalRulesets
} = require('../setup/data')

const { defaultOptions } = require('../setup/constructor')

describe('Utility Functions', () => {

    test('getOptions: should return a merged options object without any null options values.', () => {
        expect(getOptions(defaultOptions, options)).toEqual(mergedOptionsObject)
    })

    test('isArrayOfStrings: should return true when input is correct.', () => {
        const preferedRulesets = [ 'ruleset1', 'ruleset2' ]
        expect(isArrayOfStrings(preferedRulesets)).toBeTruthy()
    })

    test('isArrayOfStrings: should return false when input is incorrect.', () => {
        const preferedRulesets = { id: 'ruleset' }
        expect(isArrayOfStrings(preferedRulesets)).not.toBeTruthy()
    })

    test('organizeJurisdictionRulesetsByType: should correctly parse raw jurisdiction data and organize jurisdiction rulesets by type (pick1, optional, and required).', () => {
        expect(organizeJurisdictionRulesetsByType(rawJurisdictionData)).toEqual(jurisdictionRulesetsOrganizedByType)
    })

    test('organizeJurisdictionsByRegion: should correctly organize jurisdiction data by region, resulting in an object keyed by region.', () => {
        expect(organizeJurisdictionsByRegion(jurisdictionRulesetsOrganizedByType)).toEqual(jurisdictionOrganizedByRegion)
    })

    test('selectInitialRegion: should correctly select the initial region.', () => {
        expect(selectInitialRegion(jurisdictionOrganizedByRegion)).toBe('federal')
    })

    test('getRequiredRulesets: should handle selecting required rulesets.', () => {
        expect(getRequiredRulesets(jurisdictionRulesetsOrganizedByType)).toEqual(rulesetsList_required)
    })

    test('getPickOneRulesets: should handle selecting pick1 rulesets when preferedRulesets ARE NOT provided.', () => {
        expect(getPickOneRulesets(jurisdictionRulesetsOrganizedByType)).toEqual(rulesetsList_pick1_no_preferred)
    })

    test('getPickOneRulesets: should handle selecting pick1 rulesets when preferedRulesets ARE provided.', () => {
        expect(getPickOneRulesets(jurisdictionRulesetsOrganizedByType, ['usa_part_107'])).toEqual(rulesetsList_pick1_preferred)
    })

    test('getPickOneRulesets: should handle selecting pick1 rulesets when preferedRulesets ARE provided.', () => {
        expect(getPickOneRulesets(jurisdictionRulesetsOrganizedByType, ['usa_part_107'])).toEqual(rulesetsList_pick1_preferred)
    })

    test('getOptionalRulesets: should handle selecting optional rulesets when the enableRecommendedRulesets option is set to true.', () => {
        expect(getOptionalRulesets(optionalRulesets.unparsed, null, null, true)).toEqual(optionalRulesets.airmap_selected)
    })

})
