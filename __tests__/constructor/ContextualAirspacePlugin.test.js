/* Copyright 2018 AirMap, Inc.

Licensed under the Apache License, Version 2.0 (the License);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an AS IS BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
