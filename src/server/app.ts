'use strict'

/*
 * Imports
 */

import * as express from 'express'

// Development-only error handler middleware.
const errorhandler = require('errorhandler')

// Log requests to the console (Express 4)
import * as morgan from 'morgan'
// Pull information from HTML POST (express 4)
import * as bodyParser from 'body-parser'
// Simulate DELETE and PUT (Express 4)
import * as methodOverride from 'method-override'
// PassportJS
import * as passport from 'passport'

import {passportConf} from '../../config/passport.conf'
import
  mongooseConf, {
  connectToMongo
} from '../../config/mongoose.conf'

import {configureRouter} from './routes';

import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

import {Mongoose} from 'mongoose'
const mongoose = require('mongoose')

import {isDevEnvironment} from './utils/env.utils.js';


/**
 * Constants
 */

const STATIC_ASSETS_PATH = `${__dirname}/dist`


/**
 * Node Server Application.
 */
export class Server {

  /**
   * Express application reference.
   */
  app: express.Application


  /**
   * Bootstrap the application.
   * @static
   * @return {ng.auto.InjectorService} Returns the newly created
   * injector for this app.
   */
  public static bootstrap(): Server {
    return new Server()
  }


  /**
   * Creates a new instance of this class.
   */
  private constructor() {
    // Create `Express` application.
    this.app = express()
    // Configure `Mongoose`.
    this.configureMongoose(mongoose)
    // Configure `PassportJS`.
    this.configurePassport(passport)
    // Configure Server application.
    this.configureApplication()
    // Configure `Express` routes.
    this.configureRoutes(this.app, passport)
  }


  /**
   * Configure application.
   */
  private configureApplication(): void {

    if (isDevEnvironment())
    // Log every `request` to the console.
      this.app.use(morgan('dev'))

    // Get all data/stuff of the body (POST) parameters.

    // Parse application/json.
    this.app.use(bodyParser.json())
    // Parse application/vnd.api+json as json.
    this.app.use(bodyParser.json({type: 'application/vnd.api+json'}))
    // Parse application/x-www-form-urlencoded.
    this.app.use(bodyParser.urlencoded({extended: true}))

    // Use cookie parser middleware.
    this.app.use(cookieParser(process.env.SESSION_SECRET))

    // Override with the X-HTTP-Method-Override header in the request.
    // Simulate DELETE/PUT
    this.app.use(methodOverride('X-HTTP-Method-Override'))
    // Set the static files location /public/img will be /img for users.
    this.app.use(express.static(STATIC_ASSETS_PATH))

    // Catch `404` and forward to `error` handler
    this.app.use(function (err: { status?: number },
                           req: express.Request,
                           res: express.Response,
                           next: express.NextFunction) {
      err.status = 404
      next(err)
    })

    // PassportJS

    // Session secret
    this.app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    }))

    this.app.use(passport.initialize())

    // Persistent login sessions.
    this.app.use(passport.session())

    // Development error handler middleware.
    if (isDevEnvironment())
      this.app.use(errorhandler())

  }


  /**
   * Configure `Mongoose` instance and `MongoDB` connection.
   */
  private configureMongoose(m: Mongoose): void {
    mongooseConf(m)
    connectToMongo(m)
  }


  /**
   * Configure `PassportJS` instance.
   * @param {"passport".passport.Passport} p - Reference to `PassportJS`
   * instance.
   */
  private configurePassport(p: passport.Passport): void {
    passportConf(p)
  }


  /**
   * Configure `Express` router.
   * @param {express.Application} app - reference to the main `Express`
   * application.
   * @param {"passport".passport.Passport} p - Reference to `PassportJS`
   * instance.
   */
  private configureRoutes(app: express.Application,
                          p: passport.Passport): void {
    configureRouter(app, p)
  }


}
