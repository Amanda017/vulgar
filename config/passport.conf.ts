'use strict'

/*
 * Imports
 */

// Load PassportJS strategies
import * as local from 'passport-local'
import * as express from 'express'

// Load `User` `interfaces`, `class`, and `model`
import {
  IUser,
  UserDocument,
  Users
} from '../src/server/models/user.model'
import * as passportjs from 'passport';

const re = require('../src/server/utils/re.util')
const bounds = require('../src/server/utils/bounds.util')


// Function to check a string against a REGEX for email validity
function validateEmail(email: string) {
  // Test the passed in `email` against the specified result and
  // return the result.
  return re.email.complex.nonascii.test(email)
}


// Helper function to validate string length.
function checkLength(input: string, min: number, max: number) {
  // If the string is outside the passed in bounds...
  return (input.length > max || input.length < min) ? false : true
}


/**
 * Configure PassportJS instance
 * @param {"passport".passport.PassportStatic.Passport} passport
 * Reference to a `PassportJS` instance.
 */
export function passportConf(passport: passportjs.Passport): void {

  /*
   * PassportJS Session Configuration
   * ***Required for persistent login sessions***
   * Passport needs the ability to serialize and deserialize users
   * out of session data.
   */

  // Serialize User
  passport.serializeUser((user: UserDocument, done: any) => {
    const sessionUser = {
      _id : user._id,
      username : user.local.username,
      role : user.role
    }
    done(null, sessionUser)
  })

  // Deserialize User
  passport.deserializeUser((sessionUser: any, done: any) => {
    // The `sessionUser` object is different from the `user` mongoose
    // collection. It is actually `req.session.passport.user` and comes
    // from the `session` collection
    done(null, sessionUser)
  })

  /*
   * Local Signup
   */

  // We are using named strategies since we have one for `login` and one
  // for `signup`.
  // By default, if there is no name, it would just be called 'local'
  passport.use('local-signup', new local.Strategy({
    // By default, local strategy uses username and password.
    usernameField : 'username',
    passwordField : 'password',
    // Allow the entire request to be passed back to the callback.
    passReqToCallback : true
  }, (req: express.Request,
      username: string,
      password: string,
      done: any) => {

    /*
     * Data Checks
     */

    // If the length of the username string is too long/short,
    // invoke verify callback
    if (!checkLength(
      username, bounds.username.minLength, bounds.username.maxLength)
    ) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication failure.
       */
      return done(null,
        false,
        // Return info message object.
        { message : 'Invalid username length.' }
      )
    }
    // If the length of the password string is too long/short,
    // invoke verify callback.
    if (!checkLength(
      password, bounds.password.minLength, bounds.password.maxLength)
    ) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication failure.
       */
      return done(null,
        false,
        // Return info message object.
        { message : 'Invalid password length.' }
      )
    }
    // If the length of the email string is too long/short,
    // invoke verify callback.
    if (!checkLength(
      req.body.email, bounds.email.minLength, bounds.email.maxLength)
    ) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication failure.
       */
      return done(null,
        false,
        // Return info message object.
        { message : 'Invalid email length.' }
      )
    }
    // If the string is not a valid email...
    if (!validateEmail(req.body.email)) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication failure.
       */
      return done(null,
        false,
        // Return info message object.
        { message : 'Invalid email address.' }
      )
    }

    /*
     * Asynchronous
     */

    // Note: `User.findOne` will not fire unless data is sent back.
    process.nextTick(() => {
      // Find a user whose email or username is the same as the passed
      // in data.
      // We are checking to see if the user trying to login already
      // exists...
      Users.findOne({
        // Model.find `$or` Mongoose condition
        $or : [
          { 'local.username' : username },
          { 'local.email' : req.body.email }
        ]
      }, (err, user) => {
        // If there are any errors, return the error.
        if (err)
          return done(err)
        // If a user exists with either of those ...
        if (user) {
          /**
           * Verification callback.
           * Invoke `done` with `false` to indicate authentication
           * failure.
           */
          return done(null,
            false,
            // Return info message object.
            { message : 'That username/email is already ' +
            'taken.' }
          )
        } else {
          // If there is no user with that email or username...
          // Create the user.
          let newUser = new Users()
          // Set the user's local credentials.
          // Combat case sensitivity by converting username and
          // email to lowercase characters.
          newUser.local.username = username.toLowerCase()
          newUser.local.email = req.body.email.toLowerCase()
          // Hash password with model method.
          newUser.local.password = newUser.generateHash(password)
          // Save the new user.
          return newUser.save((err: any) => {
            if (err)
              throw err
            return done(null, newUser)
          })
        }
      })
    })
  }))

  passport.use('local-login', new local.Strategy({
    // By default, local strategy uses username and password.
    usernameField : 'username',
    passwordField : 'password',
    // Allow the entire request to be passed back to the callback.
    passReqToCallback : true
  }, (req: express.Request,
      username: string,
      password: string,
      done: any) => {

    /*
     * Data Checks
     */

    // If the length of the username string is too long/short,
    // invoke verify callback.
    // Note that the check is against the bounds of the email
    // object. This is because emails can be used to login as  well.
    if (!checkLength(
      username, bounds.username.minLength, bounds.email.maxLength)
    ) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication
       * failure.
       */
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid username/email length.' }
      )
    }
    // If the length of the password string is too long/short,
    // invoke verify callback
    if (!checkLength(
      password, bounds.password.minLength, bounds.password.maxLength)
    ) {
      /**
       * Verification callback.
       * Invoke `done` with `false` to indicate authentication
       * failure.
       */
      return done(null,
        false,
        // Return info message object.
        { message : 'Invalid password length.' }
      )
    }
    // Find a user whose email or username is the same as the passed
    // in data
    // Combat case sensitivity by converting username to lowercase
    // characters
    Users.findOne({
      // Model.find `$or` Mongoose condition
      $or : [
        { 'local.username' : username.toLowerCase() },
        { 'local.email' : username.toLowerCase() }
      ]
    }, (err, user) => {
      // If there are any errors, return the error before anything else.
      if (err)
        return done(err)
      // If no user is found, return a message.
      if (!user)
        return done(null,
          false,
          { message : 'That user was not found. '
                         + 'Please enter valid user credentials.' }
        )
      // If the user is found but the password is incorrect
      if (!user.validPassword(password))
        return done(null,
          false,
          { message : 'Invalid password entered.' }
        )
      // Otherwise all is well return successful user
      return done(null, user)
    })
  }))

}
