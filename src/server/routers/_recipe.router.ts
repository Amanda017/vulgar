'use strict'

/*
 * Imports
 */

import * as express from 'express'

// Load `Router` model
import recipe = require('../models/recipe.model')
import Recipe = recipe.Recipe // alias

import {RecipeController} from '../controllers/recipe.controller'


/*
 * Constants
 */

/**
 * Prefixed to every API endpoint.
 * @type {string}
 */
const ROUTE_PREFIX = '/recipe'


/**
 * Recipe router. Has endpoints for creating, reading, updating, and
 * destroying `Recipe` documents in the database.
 */
export class Router {

  /**
   * Controller with logic for performing CRUD operations on a `Recipe`.
   * @see src/server/controllers/recipe.controller.ts
   */
  controller: RecipeController

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
    this.controller = new RecipeController()
    // Configure the router.
    this.config()
  }


  /**
   * Reads all `Recipe` documents from the database.
   * @param {e.Request} req Reference to a `HTTP Request` object.
   * @param {e.Response} res Reference to a `HTTP Response` object
   */
  private getAll(req: express.Request, res: express.Response): void {
    this.controller.get()
      .then(
        (item) => {
          res.json(item)
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Creates a new `Recipe` document in the database from a given
   * data model. Responds with the newly created `Recipe` object if
   * successful; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param data Data model to use when creating `Recipe` document.
   * @see RecipeController.create
   */
  private create(res: express.Response, data: Recipe): void {
    this.controller.create(data)
      .then(
        (item) => {
          res.json(item)
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Searches the database for a `Recipe` document with a given `id`.
   * Responds with the `Recipe` object if one was found or null if
   * one was not; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param {string} Username of the `Recipe` document to search for.
   */
  private findOneById(res: express.Response, id: any): void {
    this.controller.findOneById(id)
      .then(
        (item) => {
          res.json(item)
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Searches the database for a `Recipe` document with a given `id`,
   * and attempts to delete it, if one is found.
   * Responds with `HTTP 204 - No Content` if the operation was
   * successful; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param {string} Id of the `Recipe` document to search for.
   */
  private removeOneById(res: express.Response, id: any): void {
    this.controller.removeOneById(id)
      .then(
        (deleted) => {
          // HTTP `204` - `No Content`
          res.sendStatus(204)
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Searches the database for a `Recipe` document with a given `id`,
   * and attempts to update it, if one is found.
   * Responds with the update `Recipe` object if  the operation was
   * successful; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param id Id of the `Recipe` document to search for.
   */
  private updateOneById(res: express.Response,
                        id: any,
                        mod: (item: Recipe) => void): void {
    this.controller.updateOneById(id, mod)
      .then(
        (item) => {
          res.send(item)
        },
        (err) => {
          res.send(err)
        }
      )
  }


  /**
   * Performs router `API` configuration, allowing CRUD operations
   * to be performed on `Recipe` documents stored in the database.
   */
  private config(): void {
    const router = this.router
    router.route(ROUTE_PREFIX)
      .get((req, res, next) => {
        this.getAll(req, res)
      })
      .post((req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {
        const newRecipe = new Recipe({
          title : req.body.title,
          tags : req.body.tags,
          rating : req.body.rating,
          creator: req.body.creator,
          description : req.body.description,
          ingredients : req.body.ingredients,
          directions : req.body.directions,
        })
        this.create(res, newRecipe)
      })
    router.route(`${ROUTE_PREFIX}/:recipe_id`)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        const id = { _id: req.params.recipe_id }
        this.findOneById(res, id)
      })
      .delete((req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {
        const id = { _id: req.params.recipe_id }
        this.removeOneById(res, id)
      })
      .put((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        const id = { _id: req.params.recipe_id }
        const mod = (r: Recipe): void => {
          // Only update a field if a new value has been passed in
          if (req.body.title)
            r.title = req.body.title
          if (req.body.tags)
            r.tags = req.body.tags
          if (req.body.rating)
            r.rating = req.body.rating
          if (req.body.creator)
            r.creator = req.body.creator
          if (req.body.description)
            r.description = req.body.description
          if (req.body.ingredients)
            r.ingredients = req.body.ingredients
          if (req.body.directions)
            r.directions = req.body.directions
        }
        this.updateOneById(res, id, mod)
      })
  }


}
