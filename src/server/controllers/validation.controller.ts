// ---------------------------------------------------------------------
// validation.controller.ts
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/3/17
// ---------------------------------------------------------------------
'use strict'

/*
 * Imports
 */

import {Model} from 'mongoose' // alias
import {
  UserDocument,
  Users
} from '../models/user.model'


/**
 * Houses logic for username validation. Checks if a given username
 * exists within the database.
 */
export class ValidationController {

  /**
   * `Mongoose` model used in controller logic.
   * @see src/server/models/recipe.model.ts
   */
  model: Model<UserDocument>


  /**
   * Creates and returns a new instance of this controller.
   */
  constructor() {
    this.model = Users
  }


  /**
   * Searches the database for a given username.
   * @param {string} username The username to search the database for.
   * @return {Promise<UserDocument>} Promise resolves returning a
   * `User` object if the operation is successful; otherwise, rejects
   * returning an error message.
   */
  findOneByUsername(username: string): Promise<UserDocument> {

    return this.model.findOne(username)
      .then(
        (user: UserDocument) => {
          return user
        },
        (err: any) => {
          return err
        }
      )

  }

}
