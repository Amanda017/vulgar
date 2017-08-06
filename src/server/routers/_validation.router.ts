'use strict'

/*
 * Imports
 */

import * as express from 'express'

import {
  ValidationController
} from '../controllers/validation.controller'

/*
 * Constants
 */

/**
 * Prefixed to every API endpoint.
 * @type {string}
 */
const ROUTE_PREFIX = '/validate'


/**
 * Validation router. Has endpoint for checking whether a given
 * username already exists in the database.
 */
export class Router {

  /**
   * Controller with logic for validating usernames.
   * @see src/server/controllers/validation.controller.ts
   */
  controller: ValidationController

  /**
   * Isolated instance of middleware and routes. Add this routes
   * middleware and routes to this router instance.
   * @see https://expressjs.com/en/api.html#router
   */
  router: express.Router

  /**
   * Bootstrap the router.
   * @param {e.Router} router Reference to isolated instance of
   * middleware and  routes.
   * @return {Router} Newly created instance of this router.
   */
  public static bootstrap(router: express.Router): Router {
    return new Router(router)
  }


  /**
   * Creates and returns a new instance of this class. Handles all
   * configuration up-front.
   * @param {e.Router} router Reference to isolated instance of
   * middleware and routes.
   */
  private constructor(router: express.Router) {
    this.router = router
    this.controller = new ValidationController()
    // Configure the router.
    this.config()
  }


  /**
   * Searches the database for a `User` document with a given
   * `username`. Responds with `HTTP Status Code - 409 Conflict` if
   * one was found or `HTTP Status Code - 404 Not Found` if one was
   * not; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param {string} Username of the `User` document to search for.
   */
  private findOneByUsername(res, username): void {
    this.controller.findOneByUsername(username)
      .then(
        (user) => {
          if (user === null) {
            // Set a `HTTP` status code of `404` `Not Found`
            res.status(404)
            // Send our validation object
            res.json({ usernameTaken: false })
          }
          else {
            // Set a `HTTP` status code of `409` `Conflict`
            res.status(409)
            // Send our validation object
            res.json({ usernameTaken: true })
          }
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Performs router `API` configuration, allowing the validation of
   * username strings.
   */
  private config(): void {
    const router = this.router
    router.route(`${ROUTE_PREFIX}/username/:username`)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        const username = { 'local.username': req.params.username }
        this.findOneByUsername(res, username)
      })
  }


}
