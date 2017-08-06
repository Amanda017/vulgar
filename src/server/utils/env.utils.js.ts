// ---------------------------------------------------------------------
// env.utils.js.ts
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/5/17
// ---------------------------------------------------------------------
'use strict'

/**
 * Checks whether the current running environment is a `development`
 * environment or not.
 * @return {boolean} Returns `true` if so; `false` if not. If no valid
 * value is set for `process.env.NODE_ENV`, return `true` by default.
 */
export function isDevEnvironment(): boolean {
  switch (process.env.NODE_ENV) {
    case ('development'):
    case ('develop'):
    case ('dev'):
    case ('test'):
      return true
    case ('production'):
    case ('prod'):
      return false
    default:
      return true
  }
}
