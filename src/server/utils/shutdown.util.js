//----------------------------------------------------------------------
// shutdown.util.js
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/1/17
//----------------------------------------------------------------------
'use strict';

/*
 * Imports
 */

// Debug logging utility.
const debug = require('debug')(`app:shutdown.util`);

// Method for gracefully terminating Mongoose connection.
import { terminateMongooseConnection } from '../../../config/mongoose.conf';

// Server-shutdown utility.
const serverShutdown = require('server-shutdown');
const gracefulExit = new serverShutdown();


/**
 * Register a server with the shutdown utility.
 * @param server Server to register.
 * @param adapter Adapter to use.
 */
function registerServer(server, adapter = serverShutdown.Adapters.http) {
  gracefulExit.registerServer(server, adapter);
}

/**
 * Perform graceful process termination.
 */
function shutdown() {
  debug('Shutting down server...');
  debug('Closing MongoDB connection...');
  terminateMongooseConnection()
    .then(
      gracefulExit.shutdown(
        () => {
          debug('All servers gracefully terminated');
          debug('Closing all existing socket connections...');
          debug('Process terminating...');
        }
      )
    );
}


/*
 * Exports
 */

module.exports = {
  shutdown: shutdown,
  registerServer: registerServer
}
