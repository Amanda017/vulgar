//----------------------------------------------------------------------
// todo.controller.ts
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

// Load `Todo` model.
import todo = require('../models/todo.model')
import TodoDocument = todo.TodoDocument // alias
import Todos = todo.Todos
import {Model} from 'mongoose'
import {Todo} from '../models/todo.model'; // alias


/**
 * Houses logic for creating, reading, updating, and deleting `Todo`
 * documents in the database.
 */
export class TodoController {

  /**
   * `Mongoose` model used in controller logic.
   * @see src/server/models/todo.model.ts
   */
  model: Model<TodoDocument>


  /**
   * Creates and returns a new instance of this controller.
   */
  constructor() {
    this.model = Todos
  }


  /**
   * Read all `TodoDocuments` stored in the database and return them
   * in an array.
   * @return {Promise<TodoDocument[]>} Promise resolves returning an
   * array of all `Todo` documents stored in the database;
   * otherwise, rejects returning an error message.
   */
  public get(): Promise<TodoDocument[]> {
    return this.model.find()
      .then(
        (items: TodoDocument[]) => {
          return items
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Creates a new `Todo` and saves it in the database.
   * @param {"mongoose".Model<TodoDocument>} dataModel Model to
   * construct database document from.
   * @return {Promise<TodoDocument>} Promise resolves returning the
   * created `Todo` object if successful; otherwise, rejects
   * returning an error message.
   */
  public create(dataModel: Todo): Promise<TodoDocument> {
    return this.model.create(dataModel)
      .then(
        (item: TodoDocument) => {
          return item
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Searches the database for a `Todo` document corresponding to a
   * given `id`.
   * @param id Id of the `Todo` document in the database.
   * @return {Promise<TodoDocument>} Promise resolves returning the
   * located `Todo` object if successful; otherwise, rejects
   * returning an error message.
   */
  public findOneById(id: any): Promise<TodoDocument> {
    return this.model.findOne(id)
      .then(
        (item: TodoDocument) => {
          return item
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Searches the database for a `Todo` document corresponding to a
   * given `id` and deletes it, should it find one.
   * @param id Id of the `Todo` document in the database.
   * @return {Promise<TodoDocument>} Promise resolves returning
   * nothing if deletion is successful; otherwise, rejects returning
   * an error message.
   */
  public removeOneById(id: any): Promise<void> {
    return this.model.remove(id)
      .then(
        () => {
          return true
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Searches the database for a `Todo` document corresponding to a
   * given `id` and updates it using a given modification function,
   * should it find one.
   * @param id Id of the `Todo` document in the database.
   * @param mod Function which modifies the document data in the desired
   * way.
   * @return {Promise<TodoDocument>} Promise resolves returning the
   * modified `Todo` document if updating is successful; otherwise,
   * rejects returning an error message.
   */
  public updateOneById(id: string,
                       mod: (item: Todo) => void): Promise<TodoDocument> {
    return this.model.findOne(id)
      .then(
        (item: TodoDocument) => {
          mod(item)
          return item.save(
            (saveError: any, moddedItem: TodoDocument) => {
              if (saveError)
                return saveError
              else
                return moddedItem
            }
          )
        },
        (findError: any) => {
          return findError
        }
      )
  }

}
