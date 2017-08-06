// ```
// user.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// user.model.js may be freely distributed under the MIT license
// ```
'use strict'

/*
 * User Model
 * Note: MongoDB will autogenerate an `_id` for each `User` object
 * created.
 */


/*
 * Imports
 */

// Grab the Mongoose module
import mongoose = require('mongoose')
const Schema = mongoose.Schema

// Import library to hash passwords
import * as bcrypt from 'bcrypt-nodejs'


/**
 * `User` Interface.
 */
export interface IUser {
  /**
   * Object used for the `local-signup` and `local-login` strategies of
   * `PassportJS`.
   */
  local: {
    username: string
    password: string
    email: string
  }
  /**
   * User role. // TODO: Use enum over string.
   */
  role: string
}


/**
 * Concrete `User` class implementing the `IUser` interface.
 * @see IUser
 */
export class User implements IUser {
  local: {
    username: string
    password: string
    email: string
  }
  role: string


  /**
   * Creates and returns a new instance of this class.
   * @param {IUser} data Data from which to source the data for
   * the new `User` instance.
   * @param {string} role User role. Could be admin, member, et cetera.
   */
  constructor(data: IUser, role: string) {
    this.local.username = data.local.username
    this.local.password = data.local.password
    this.local.email = data.local.email
    this.role = role || ''
  }


  /**
   * Generate a hash given a password string.
   * @param password Password string.
   * @return {string} Password hash.
   */
  generateHash(password): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }


  /**
   * Check if a given password matches the hashed version stored
   * with the database.
   * @param password Password string.
   * @return {boolean} `true` if the given password was valid; `false`
   * otherwise.
   */
  validPassword(password): boolean {
    return bcrypt.compareSync(password, this.local.password)
  }

}

/**
 * `User` Schema.
 * @type {"mongoose".Schema}
 */
const userSchema = new Schema({
  local : {
    username : { type : String, unique : true },
    password : String,
    email : { type : String, unique : true }
  },
  role : { type : String }
})


/*
 * Method Registration
 */

userSchema.method('generateHash', User.prototype.generateHash)
userSchema.method('validPassword', User.prototype.validPassword)


/*
 * Exports
 */

// Export `Document`
export interface UserDocument extends User, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export const Users = mongoose.model<UserDocument>('User', userSchema)
