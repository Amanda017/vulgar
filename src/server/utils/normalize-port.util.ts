'use strict'

/**
 * Normalize a port into a number, string, or false.
 */
export function normalizePort(input: string):
  boolean | string | number {

  const port = parseInt(input, 10)

  if (isNaN(port))
    // Named pipe.
    return input

  if (port >= 0)
    // Port number.
    return port

  return false

}
