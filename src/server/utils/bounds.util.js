// ---------------------------------------------------------------------
// bounds.util.js
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/5/17
// ---------------------------------------------------------------------
'use strict'

module.exports = {
  username : {
    minLength : 3,
    maxLength : 16
  },
  password : {
    minLength : 8,
    maxLength : 128
  },
  email : {
    minLength : 5,
    maxLength : 254
  }
}
