import { config, defaultOptions } from '__tests__/setup/constructor'
import ContextualAirspacePlugin from 'src/index.js'

describe('ContextualAirspacePlugin#constructor', () => {

    test('should provide the expected defaults options if none are specified', () => {
        const expected = defaultOptions
        const actual = new ContextualAirspacePlugin(config, defaultOptions)
        expect(actual.defaults).toEqual(expected)
    })

    test('should override defaults if options are provided', () => {
        const expected = {
            ...defaultOptions,
            theme: 'dark'
        }
        const actual = new ContextualAirspacePlugin(config, { theme: 'dark' })
        expect(actual.options).toEqual(expected)
    })

})
