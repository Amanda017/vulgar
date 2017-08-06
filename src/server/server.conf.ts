'use strict'

/*
 * Imports
 */

// Load `Node` `http` module.
const http = require('http')

// Debug logging utility.
import {IDebug} from 'debug'
const debug: IDebug = require('debug')(`app:server`)

// Graceful shutdown utilities.
const serverShutdown = require('server-shutdown')
const shutdownUtility = require('./utils/shutdown.util')

// Load Socket.io
import * as socketio from 'socket.io'
import {configureSocket} from './sockets/base.socket'

// Import utility functions for port normalization and error handling.
import {onError} from './utils/on-error.util'
import {normalizePort} from './utils/normalize-port.util'

// Load Node environment variable configuration utilities.
import {validateEnvVariables} from '../../config/env.conf'
import {isDevEnvironment} from './utils/env.utils.js'
// Set up appropriate environment variables if necessary.
validateEnvVariables()


/**
 * Constants
 */

const FALLBACK_PORT = 3000
const FALLBACK_SOCKET = 3001


// Module Dependencies
const app = require('./app')
const injector = app.Server.bootstrap().app

// Set `PORT` based on environment and store in `Express`
const PORT = normalizePort(process.env.PORT) !== undefined
  ? normalizePort(process.env.PORT)
  : FALLBACK_PORT

injector.set('port', PORT)

// Create `http` server.
const server = http.createServer(injector)

// Integrate Socket.io.
const SOCKET_PORT = normalizePort(process.env.SOCKET_PORT) !== undefined
  ? normalizePort(process.env.SOCKET_PORT)
  : FALLBACK_SOCKET

// Listen on the specified port.
const io = socketio.listen(SOCKET_PORT)

// Configure SocketIO functionality.
configureSocket(io)

// Register servers with shutdown utility.
shutdownUtility.registerServer(server)
shutdownUtility.registerServer(io, serverShutdown.Adapters.socketio)

// Listen on the provided `PORT`.
server.listen(PORT)

// Add handler for `error` event.
server.on('error', onError)

// Add handler for `listening` event.
server.on('listening', onListening)

// Add handlers for POSIX signal events.
process
  .on('SIGINT', shutdownUtility.shutdown)


/*
 * Utilities
 */

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {

  const address = server.address()

  const bind = typeof address === 'string'
    ? 'pipe ' + address
    : 'port ' + address.port

  if (isDevEnvironment())
    debug(`Wizardry is afoot on ${bind}`)
    debug(`Use CTRL + C to terminate.`)

}
