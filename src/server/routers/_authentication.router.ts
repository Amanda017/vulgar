'use strict'

/*
 * Imports
 */

import * as express from 'express'
import * as passportjs from 'passport'

import {AuthController} from '../controllers/authentication.controller'


/*
 * Constants
 */

/**
 * Prefixed to every API endpoint.
 * @type {string}
 */
const ROUTE_PREFIX = '/auth'

/**
 * Authentication function type declaration.
 */
export type AuthFn = (req: express.Request,
                      res: express.Response,
                      next: express.NextFunction) => void;


/**
 * Authentication router. Has endpoints for creating,
 * reading, updating, and destroying `User` documents in the database.
 */
export class Router {

  /**
   * Controller with logic for performing CRUD operations on a `User`
   * model and other authentication related tasks.
   * @see src/server/controllers/authentication.controller.ts
   */
  controller: AuthController

  /**
   * Isolated instance of middleware and routes. Add this routes
   * middleware and routes to this router instance.
   * @see https://expressjs.com/en/api.html#router
   */
  router: express.Router

  /**
   * Authentication middleware for Node.js. Allows access to
   * a wide range of authentication strategies.
   * @see http://passportjs.org/
   */
  passport: passportjs.Passport

  /**
   * Middleware function to be used for all secured routes that are
   * accessible to normal users.
   */
  auth: AuthFn;

  /**
   * Middleware function to be used for all secured administration
   * routes.
   */
  admin: AuthFn;

  /**
   * Bootstrap the router.
   * @static
   * @param {e.Router} router Reference to isolated instance of
   * middleware and  routes.
   * @param {"passport".passport.Passport} passport Reference to
   * PassportJS instance.
   * @param {AuthFn} auth Authentication function.
   * @param {AuthFn} admin Administration authentication function.
   * @return {Router} Newly created instance of this router.
   */
  public static bootstrap(router: express.Router,
                          passport: passportjs.Passport,
                          auth: AuthFn,
                          admin: AuthFn): Router {
    return new Router(router, passport, auth, admin)
  }


  /**
   * Creates and returns a new instance of this class. Handles all
   * configuration up-front.
   * @param {e.Router} router Reference to isolated instance of
   * middleware and routes.
   * @param {"passport".passport.Passport} passport Reference to
   * PassportJS instance.
   * @param {AuthFn} auth Authentication function.
   * @param {AuthFn} admin Administration authentication function.
   */
  private constructor(router: express.Router,
                      passport: passportjs.Passport,
                      auth: AuthFn,
                      admin: AuthFn) {
    this.router = router
    this.controller = new AuthController()
    this.passport = passport
    this.auth = auth
    this.admin = admin
    // Configure the router.
    this.config()
  }


  /**
   * Performs router `API` configuration, allowing CRUD and
   * authentication operations to be performed on `Recipe` documents
   * stored in the database.
   */
  private config(): void {
    // TODO: Throw error if there is no router. Do for all controllers.
    const router = this.router
    router.route(`${ROUTE_PREFIX}/authenticate`)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        this.controller.authenticate(req, res)
      })
    router
      .delete(`${ROUTE_PREFIX}/delete/:uid`,
        this.admin,
        (req: express.Request, res: express.Response) => {
          this.controller.delete(req, res)
        }
      )
    router.route(`${ROUTE_PREFIX}/login`)
      .post((req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {
        this.controller.login(req, res, next)
      })
    router.route(`${ROUTE_PREFIX}/logout`)
      .post((req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {
        this.controller.logout(req, res)
      })
    router.route(`${ROUTE_PREFIX}/register`)
      .post((req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {
        this.controller.register(req, res, next)
      })
    router
      .get(`${ROUTE_PREFIX}/session`,
        this.auth,
        (req: express.Request, res: express.Response) => {
          this.controller.getSessionData(req, res)
        }
      )
  }


}
