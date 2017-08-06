//----------------------------------------------------------------------
// authentication.controller.ts
//
// Copyright (c) David Newman 2017 - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly
// prohibited.
// Proprietary and confidential
// Written by David Newman <david.r.niciforovic@gmail.com> on 8/3/17
//----------------------------------------------------------------------
'use strict'
/*
 * Imports
 */

import {
  User,
  UserDocument,
  Users
} from '../models/user.model'

import * as express from 'express'
import * as passport from 'passport'
import {Model} from 'mongoose'

// Load the `Mongoose` `ObjectId` function to cast string as `ObjectId`
const ObjectId = require('mongoose').Types.ObjectId

/**
 * User authentication controller. Houses logic for user creation,
 * destruction, authentication, session data retrieval, et cetera.
 */
export class AuthController {

  /**
   * `Mongoose` model used in controller logic.
   * @see src/server/models/user.model.ts
   */
  model: Model<UserDocument>


  /**
   * Creates and returns a new instance of this controller.
   */
  constructor() {
    this.model = Users
  }


  /**
   * Deletes a `User` from the database.
   * Responds with an error json object if there was an error during
   * removal; else responds with `HTTP` Status code `204 No Content`.
   * @param {e.Request} req Incoming `HTTP` request object.
   * @param {e.Response} res Outgoing `HTTP` response object.
   */
  public delete(req: express.Request,
                res: express.Response) {
    Users.remove({
      // `Model.find` `$or` `Mongoose` condition
      $or: [
        {'local.username': req.params.uid},
        {'local.email': req.params.uid},
        {'_id': ObjectId(req.params.uid)}
      ]
    }, (err: any) => {
      // If there are any errors, respond with them.
      if (err)
        res.json(err)
      // `HTTP` Status code `204 No Content`.
      res.sendStatus(204)
    })
  }


  /**
   * Responds with user session object for disassembly further down the
   * line.
   * @param {e.Request} req Incoming HTTP request object.
   * @param {e.Response} res Outgoing HTTP response object.
   */
  public getSessionData(req: express.Request,
                        res: express.Response) {
    // Send response in JSON to allow disassembly of object by
    // functions.
    res.json(req.user)
  }


  /**
   * Attempt to log a user in using the `local-signup` `PassportJS`
   * strategy.
   * If the user credentials fail, responds with HTTP status code
   * `401 Unauthorized`.
   * Otherwise, if the login operation is successful, return `HTTP`
   * status code `200 OK`.
   * @param {e.Request} req Incoming `HTTP` request object.
   * @param {e.Response} res Outgoing `HTTP` response object.
   * @param {e.NextFunction} next Call the next middleware, allowing
   * stacking and fallbacks.
   * @see config/passport.conf.ts
   */
  public login(req: express.Request,
               res: express.Response,
               next: express.NextFunction) {
    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the
    // `req` and `res` object through closure.
    // If authentication fails, `user` will be set to `false`.
    // If an exception occurred, `err` will be set. `info` contains a
    // message set within the
    // `local-signup` PassportJS strategy.
    passport.authenticate('local-login',
      (err: any, user: User, info: { message: string }) => {
        if (err)
          return next(err)
        // If no user is returned...
        if (!user) {
          // Set `HTTP` status code `401 Unauthorized`.
          res.status(401)
          // Call the next middleware, passing in the info message.
          return next(info.message)
        }
        // Use login function exposed by `PassportJS` to establish a
        // login session
        req.login(user, (error: any) => {
          if (error)
            return next(error)
          // Set `HTTP` status code `200 OK`.
          res.status(200)
          // Respond with the user object.
          res.send(req.user)
        })
      }
    )(req, res, next)
  }


  /**
   * Logs the currently authenticated user out, invalidating the session.
   * Responds with `HTTP` status code `401 Unauthorized` upon successful
   * user log out.
   * @param {e.Request} req Incoming HTTP request object.
   * @param {e.Response} res Outgoing HTTP response object.
   */
  public logout(req: express.Request,
                res: express.Response) {
    req.logOut()
    // Even though the logout was successful, send the status code `401`
    // to be intercepted and reroute the user to the appropriate page.
    res.sendStatus(401)
  }


  /**
   * Attempts to register a user with `PassportJS`, using the
   * `local-signup` strategy, which simply accepts a username and a
   * password.
   * If there is a problem, no user is returned by `PassportJS` and the
   * response status is set to `HTTP` status code `409 Conflict`
   * along with an info message.
   * @param {e.Request} req Incoming `HTTP` request object.
   * @param {e.Response} res Outgoing `HTTP` response object.
   * @param {e.NextFunction} next Call the next middleware, allowing
   * stacking and fallbacks.
   * @see config/passport.conf.ts
   */
  public register(req: express.Request,
                  res: express.Response,
                  next: express.NextFunction) {
    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the
    // `req` and `res` object through closure.
    // If authentication fails, `user` will be set to `false`.
    // If an exception occurred, `err` will be set. `info` contains a
    // message set within the `local-signup` `PassportJS` strategy.
    // If the registration operation is successful, the response status
    // is set to `HTTP` status code `204 No Content`.
    passport.authenticate('local-signup',
      (err: any, user: User, info: { message: string }) => {
        if (err)
          return next(err)
        // If no user is returned...
        if (!user) {
          // Set `HTTP` status code `409 Conflict`
          res.status(409)
          // Return the info message
          return next(info.message)
        }
        // Set `HTTP` status code `204 No Content`
        res.sendStatus(204)
      }
    )(req, res, next)
  }


  /**
   * Checks whether the user is authenticated.
   * If so, a `User` session object is sent as a response, otherwise a
   * response of `0` is sent.
   * @param {e.Request} req Incoming HTTP request object.
   * @param {e.Response} res Outgoing HTTP response object.
   */
  public authenticate(req: express.Request,
                      res: express.Response) {
    // If the user is authenticated, respond with a `user` session
    // object else respond `0`
    res.send(req.isAuthenticated() ? req.user : '0')
  }


}
