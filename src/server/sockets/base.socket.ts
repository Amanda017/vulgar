// ```
// base.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// base.ts may be freely distributed under the MIT license
// ```
'use strict'

/*
 * Imports
 */

// Debug logging utility.
import {IDebug} from 'debug'
const debug: IDebug = require('debug')(`app:socket`)


/**
 * Configure a SocketIO.Server with basic functionality.
 * @param {SocketIO.Server} io Reference to a SocketIO.Server instance.
 */
export function configureSocket(io: SocketIO.Server) {

  io.sockets.on('connect', (socket: SocketIO.Socket) => {

    let handle: string = 'unknown'

    debug(`{socket} [client:connect] ${ handle } client connected`)

    socket.on('disconnect', () => {
      debug(`{socket} [client:disconnect] ${ handle } disconnected`)
      io.emit(
        'chat:message',
        `{socket} ${ handle } has left the channel`
      )
    })

    socket.on('chat:message', (message: string) => {
      // Just relay all messages to everybody.
      io.emit('chat:message', `${ handle } : ${ message }`)
      // Logging.
      debug(`{socket} [chat:message] ${ handle } : ${ message }`)
    })

    socket.on('chat:register', (input: string) => {
      handle = input
      debug(`{socket} [client:register] ${ handle } has registered `
       + `with the server`)
      io.emit(
        'chat:message',
        `{socket} ${ handle } has joined the channel`
      )
    })

  })

  // Destroy existing connections upon process termination.
  process.on('SIGINT', () => {
    destroyExistingConnections(io)
  })

}

/**
 * Iterate through all connected sockets and destroy existing
 * connections.
 * @param {SocketIO.Server} io Reference to a SocketIO Server.
 */
export function destroyExistingConnections(io: SocketIO.Server): void {
  Object.keys(io.sockets.sockets).forEach((s: string) => {
    io.sockets.sockets[s].disconnect(true)
  })
}
