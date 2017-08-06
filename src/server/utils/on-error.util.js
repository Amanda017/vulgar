'use strict'

const error = require('debug')('app:error');

/**
 * Event listener for HTTP server "error" event.
 */
export function onError(err) {
  if (err.syscall !== 'listen')
    throw err;

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen `errors` with human-friendly messages
  switch (err.code) {
    case 'EACCES':
      error(`${bind} requires elevated privileges!`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      error(`${bind} is already in use!`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}
