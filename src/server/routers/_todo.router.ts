'use strict'

/*
 * Imports
 */

import * as express from 'express'

// Load `Todo` model
import todo = require('../models/todo.model')
import Todo = todo.Todo // alias

import {TodoController} from '../controllers/todo.controller'


/*
 * Constants
 */

/**
 * Prefixed to every API endpoint.
 * @type {string}
 */
const ROUTE_PREFIX = '/todo'

/**
 * Recipe router. Has endpoints for creating, reading, updating, and
 * destroying `Todo` documents in the database.
 */
export class Router {

  /**
   * Controller with logic for performing CRUD operations on a `Recipe`.
   * @see src/server/controllers/recipe.controller.ts
   */
  controller: TodoController

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
    this.controller = new TodoController()
    // Configure the router.
    this.config()
  }

  /**
   * Reads all `Todo` documents from the database.
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
   * Creates a new `Todo` document in the database from a given
   * data model. Responds with the newly created `Todo` object if
   * successful; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param data Data model to use when creating `Todo` document.
   * @see TodoController.create
   */
  private createTodo(res: express.Response, data: Todo): void {
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
   * Searches the database for a `Todo` document with a given `id`.
   * Responds with the `Todo` object if one was found or null if
   * one was not; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param {string} Id of the `Todo` document to search for.
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
   * Searches the database for a `Todo` document with a given `id`,
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
   * Searches the database for a `Todo` document with a given `id`,
   * and attempts to update it, if one is found.
   * Responds with the update `Todo` object if  the operation was
   * successful; sends an `error` if something went wrong.
   * @param {e.Response} res Reference to a `HTTP Response` object
   * @param id Id of the `Todo` document to search for.
   */
  private updateOneById(res: express.Response,
                        id: any,
                        mod: (item: Todo) => void): void {
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
   * to be performed on `Todo` documents stored in the database.
   */
  private config(): void {
    const router = this.router
    router.route(ROUTE_PREFIX)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        // Use mongoose to get all requested items in the database.
        this.getAll(req, res)
      })
      .post((req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {
        this.createTodo(res, new Todo({ text: req.body.text}))
      })
    router.route(`${ROUTE_PREFIX}/:todo_id`)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        const id = { _id: req.params.todo_id }
        this.findOneById(res, id)
      })
      .delete((req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {
        const id = { _id: req.params.todo_id }
        this.removeOneById(res, id)
      })
      .put((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        const id = { _id: req.params.todo_id }
        const mod = (t: Todo): void => {
          // Only update a field if a new value has been passed in.
          if (req.body.text)
            t.text = req.body.text
        }
        this.updateOneById(res, id, mod)
      })
  }


}
