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

/**
 * Error caused when config is malformatted.
 * @private
 */
export class BadConfigError extends Error {
    constructor(item) {
        super(`AirMap Rules Plugin - unable to initialize due to missing configuration item: ${item}`)
    }
}

/**
 * Error caused when option is malformatted.
 * @private
 */
export class BadOptionError extends Error {
    constructor(item) {
        super(`AirMap Rules Plugin - the value provided for the following option is invalid: ${item}`)
    }
}

/**
 * Warning the user when option is malformatted.
 * @private
 */
export function BadOptionWarn(item) {
    return console.warn(`AirMap Rules Plugin - the value provided for the following option is invalid: ${item}`)
}
