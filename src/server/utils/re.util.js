// ---------------------------------------------------------------------
// re.util.js
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/5/17
// ---------------------------------------------------------------------
'use strict'

module.exports = {
  email: {
    complex: {
      /**
       * Complex Javascript Regex (ASCII Only)
       * @see https://regex101.com/r/dZ6zE6/1#
       */
      ascii: /^(?=[A-Za-z0-9][A-Za-z0-9@._%+-]{5,253}$)[A-Za-z0-9._%+-]{1,64}@(?:(?=[A-Za-z0-9-]{1,63}\.)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.){1,8}[A-Za-z]{2,63}$/i,
      /**
       * Complex Javascript Regex (With Non ASCII Support)
       * @see https://regex101.com/r/sF6jE4/1
       */
      nonascii: /^(?=([A-Za-z0-9]|[^\x00-\x7F])([A-Za-z0-9@._%+-]|[^\x00-\x7F]){5,253}$)([A-Za-z0-9._%+-]|[^\x00-\x7F]){1,64}@(?:(?=([A-Za-z0-9-]|[^\x00-\x7F]){1,63}\.)([A-Za-z0-9]|[^\x00-\x7F])+(?:-([A-Za-z0-9]|[^\x00-\x7F])+)*\.){1,8}([A-Za-z]|[^\x00-\x7F]){2,63}$/i
    },
    simple: {
      /**
       * Simple 'Good Enough' Javascript Regex (ASCII Only)
       * https://regex101.com/r/aI9yY6/1
       */
      ascii: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/i,
      /**
       * Simple 'Good Enough' Javascript Regex (With Non ASCII Support)
       * @see https://regex101.com/r/hM7lN3/1
       */
      nonascii: /^([a-zA-Z0-9._%+-]|[^\x00-\x7F])+?@([a-zA-Z0-9.-]|[^\x00-\x7F])+\.([a-zA-Z]|[^\x00-\x7F]){2,63}$/i
    }
  }
}
