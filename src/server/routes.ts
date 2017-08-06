// ```
// routes.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// routes.js may be freely distributed under the MIT license
// ```
'use strict'

/*
 * Imports
 */

import * as express from 'express'
import * as passportjs from 'passport'

// Load our `API` routes for user authentication.
import * as authRouter from './routers/_authentication.router'
// Load our `API` router for the `validation` service.
import * as validationRouter from './routers/_validation.router'
// Load our `API` router for the `todo` component.
import * as todoRouter from './routers/_todo.router'
// Load our `API` router for the `recipe` component.
import * as recipeRouter from './routers/_recipe.router'

// Debug logging utility.
import { IDebug } from 'debug'
const debug: IDebug = require('debug')(`app:routes`)

// Node environment utility.
import {isDevEnvironment} from './utils/env.utils.js'


/*
 * Constants
 */

const API_PREFIX = '/api'

const STATIC_CLIENT_ASSET_PATH = 'dist/client'

/*
 * Node API Routes
 * Configure `Express` router.
 */
export function configureRouter(app: express.Application,
                                passport: passportjs.Passport): void {

  // Get an instance of the `express` `Router`
  const router: express.Router = express.Router()

  // Keep track of `http` requests
  let numReqs: number = 0

  // Express Middlware to use for all requests.
  router.use((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {

    if (isDevEnvironment())
      numReqs++
      debug('I sense a disturbance in the force...')
      debug(`Requests served since last restart: ${numReqs}`)

    // Make sure we go to the next routes and don't stop here...
    next()
  })

  // Define a middleware function to be used for all secured routes.
  const auth = (req: express.Request,
                res: express.Response,
                next: express.NextFunction): void => {
    if (!req.isAuthenticated())
      res.send(401)
    else
      next()
  }

  // Define a middleware function to be used for all secured
  // administration routes.
  const admin = (req: express.Request,
                 res: express.Response,
                 next: express.NextFunction): void => {
    if (!req.isAuthenticated() || req.user.role !== 'admin')
      res.send(401)
    else
      next()
  }

  /*
   * Server Routes
   */

  // Handle things like API calls,

  /*
   * Authentication routes
   */

  // Pass in our Express app and Router.
  // Also pass in auth & admin middleware and Passport instance.
  authRouter.Router.bootstrap(router, passport, auth, admin)

  /*
   * RESTful API Routes
   */

  validationRouter.Router.bootstrap(router)
  todoRouter.Router.bootstrap(router)
  recipeRouter.Router.bootstrap(router)

  // All of our routes will be prefixed with `/api`
  app.use(API_PREFIX, router)

  /**
   * Frontend Routes
   */

  // Serve static front-end assets
  app.use(express.static(STATIC_CLIENT_ASSET_PATH))

  // Route to handle all Angular requests.
  app.get('*', (req: express.Request, res: express.Response) => {
    // Load the `src/app.html` file.
    // Note that the root is set to the parent of this folder, ie the
    // app root.
    res.sendFile(
      `${STATIC_CLIENT_ASSET_PATH}/index.html`,
      { root: `${__dirname}/../../` }
    )
  })

  // Use configured `router` middleware.
  app.use(router)

}
