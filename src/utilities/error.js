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
