// ```
// env.conf.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// env.conf.js may be freely distributed under the MIT license
// ```

// Reference : http://thewebivore.com/super-simple-environment-variables-node-js/#comment-286662

/*
 * Imports
 */

// Import configuration file.
const config = require('./config')

// Debug logging utility.
import { IDebug } from 'debug'
const debug: IDebug = require('debug')(`app:env_configuration`)


/**
 * Check each necessary node `environment variable` to see if a
 * value has been set and if not, use the `config` object to
 * supply appropriate values
 */
export function validateEnvVariables(): void {

  // If no value has been assigned to our environment variables,
  // set them up...

  if(!process.env.NODE_ENV)
    process.env.NODE_ENV = config.ENV

  // Check to see if `process.env.NODE_ENV` is valid.
  validateNodeEnvironment()

  // For Express/Passport
  if (!process.env.SESSION_SECRET)
    process.env.SESSION_SECRET = config.SESSION_SECRET

  if (!process.env.PORT)
    process.env.PORT = config.PORT

  if(!process.env.SOCKET_PORT)
    process.env.SOCKET_PORT = config.SOCKET_PORT

  // Set the appropriate `MongoDB` `URI`
  validateMongoUri()

}


/**
 * Check to see that the `process.env.NODE_ENV has been
 * set to an appropriate value of `development`, `production`
 * or `test`. If not, alert the user and default to `development`
 */
function validateNodeEnvironment(): void {

  switch(process.env.NODE_ENV) {
    case 'development':
    case 'develop':
    case 'dev':
      debug(`Node environment set for ${process.env.NODE_ENV}`)
      break
    case 'production':
    case 'prod':
      debug(`Node environment set for ${process.env.NODE_ENV}`)
      break
    case 'test':
      debug(`Node environment set for ${process.env.NODE_ENV}`)
      break
    default:
      debug('Error: process.env.NODE_ENV should be set to a valid '
        + 'value such as \'production\', \'development\', or \'test\'.')
      debug(`Value received: ${process.env.NODE_ENV}`)
      debug('Defaulting value for: development')
      process.env.NODE_ENV = 'development'
      break
  }

}


/**
 * Set the appropriate `MongoDB` `URI` with the `config` object based on
 * the value in `process.env.NODE_ENV`.
 */
function validateMongoUri(): void {

  if (!process.env.MONGO_URI) {

    debug('No value set for MONGO_URI...')
    debug('Using the supplied value from config object...')

    switch(process.env.NODE_ENV) {
      case 'development':
      case 'develop':
      case 'dev':
        process.env.MONGO_URI = config.MONGO_URI.DEVELOPMENT
        debug(`MONGO_URI set for ${process.env.NODE_ENV}`)
        break
      case 'production':
      case 'prod':
        process.env.MONGO_URI = config.MONGO_URI.PRODUCTION
        debug(`MONGO_URI set for ${process.env.NODE_ENV}`)
        break
      case 'test':
        process.env.MONGO_URI = config.MONGO_URI.TEST
        debug(`MONGO_URI set for ${process.env.NODE_ENV}`)
        break
      default:
        debug('Unexpected behavior! process.env.NODE_ENV set to ' +
          'unexpected value!')
        break
    }

  }

}
