//----------------------------------------------------------------------
// recipe.controller.ts
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

// Load `Recipe` model
import recipe = require('../models/recipe.model')
import RecipeDocument = recipe.RecipeDocument // alias
import Recipes = recipe.Recipes // alias
import {Model} from 'mongoose'
import {Recipe} from '../models/recipe.model';


/**
 * Houses logic for creating, reading, updating, and deleting `Recipe`
 * documents in the database.
 */
export class RecipeController {

  /**
   * `Mongoose` model used in controller logic.
   * @see src/server/models/recipe.model.ts
   */
  model: Model<RecipeDocument>


  /**
   * Creates and returns a new instance of this controller.
   */
  constructor() {
    this.model = Recipes
  }


  /**
   * Read all `RecipeDocuments` stored in the database and return them
   * in an array.
   * @return {Promise<RecipeDocument[]>} Promise resolves returning an
   * array of all `Recipe`
   * documents stored in the database; otherwise, rejects returning an
   * error message.
   */
  public get(): Promise<RecipeDocument[]> {
    return this.model.find()
      .then(
        (items: RecipeDocument[]) => {
          return items
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Creates a new `Recipe` and saves it in the database.
   * @param {"mongoose".Model<RecipeDocument>} dataModel Model to
   * construct database document from.
   * @return {Promise<RecipeDocument>} Promise resolves returning the
   * created `Recipe` object if successful; otherwise, rejects
   * returning an error message.
   */
  public create(dataModel: Recipe): Promise<RecipeDocument> {
    return this.model.create(dataModel)
      .then(
        (item: RecipeDocument) => {
          return item
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Searches the database for a `Recipe` document corresponding to a
   * given `id`.
   * @param id Id of the `Recipe` document in the database.
   * @return {Promise<RecipeDocument>} Promise resolves returning the
   * located `Recipe` object if successful; otherwise, rejects
   * returning an error message.
   */
  public findOneById(id: any): Promise<RecipeDocument> {
    return this.model.findOne(id)
      .then(
        (item: RecipeDocument) => {
          return item
        },
        (err: any) => {
          return err
        }
      )
  }


  /**
   * Searches the database for a `Recipe` document corresponding to a
   * given `id` and deletes it, should it find one.
   * @param id Id of the `Recipe` document in the database.
   * @return {Promise<RecipeDocument>} Promise resolves returning
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
   * Searches the database for a `Recipe` document corresponding to a
   * given `id` and updates it using a given modification function,
   * should it find one.
   * @param id Id of the `Recipe` document in the database.
   * @param mod Function which modifies the document data in the desired
   * way.
   * @return {Promise<RecipeDocument>} Promise resolves returning the
   * modified `Recipe` document if updating is successful;
   * otherwise, rejects returning an error message.
   */
  public updateOneById(id: any,
                       mod: (item: Recipe) => void): Promise<RecipeDocument> {
    return this.model.findOne(id)
      .then(
        (item: RecipeDocument) => {
          mod(item)
          return item.save(
            (saveError: any, moddedItem: RecipeDocument) => {
              if (saveError)
                return saveError
              else
                return moddedItem
            }
          )
        },
        (removalError: any) => {
          return removalError
        }
      )
  }


}
