// ```
// recipe.model.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// recipe.model.js may be freely distributed under the MIT license
// ```
'use strict'

/*
 * Recipe Model
 * Note: MongoDB will autogenerate an `_id` for each `Recipe` object
 * created.
 */

/*
 * Imports
 */

// Grab the Mongoose module.
import mongoose = require('mongoose')
const Schema = mongoose.Schema


/**
 * Recipe Interface.
 */
interface IRecipe {

  /**
   * Recipe title.
   */
  title: string

  /**
   * Tags which apply to this Recipe.
   */
  tags: Array<any>

  /**
   * User rating.
   */
  rating: number

  /**
   * Creator of this Recipe.
   */
  creator: string

  /**
   * Brief description of the Recipe.
   */
  description: string

  /**
   * Array of objects representing the ingredients of the Recipe.
   */
  ingredients: {
    amount: string
    unit: string
    name: string
  }

  /**
   * Array of directions for making the Recipe.
   */
  directions: Array<any>

}


/**
 * Concrete recipe class.
 * @see IRecipe
 */
export class Recipe implements IRecipe {

  title: string
  tags: Array<any>
  rating: number
  creator: string
  description: string
  ingredients: {
    amount: string
    unit: string
    name: string
  }
  directions: Array<string>

  /**
   * Creates and returns a new instance of this class.
   * @param {IRecipe} data Data from which to source the data for
   * the new Recipe instance.
   */
  constructor(data: IRecipe) {
    this.title = data.title
    this.tags = data.tags
    this.rating = data.rating
    this.creator = data.creator
    this.description = data.description
    this.ingredients = data.ingredients
    this.directions = data.directions
  }
}


/**
 * Recipe Schema.
 */
const recipeSchema = new Schema({
  title: { type : String },
  tags: { type: Array },
  rating: { type: Number},
  creator: { type: String},
  description: { type : String },
  ingredients: [{
    amount: {
      type: String
    },
    unit: {
      type: String
    },
    name: {
      type: String
    }
  }],
  directions: { type: Array }
})


/*
 * Exports
 */

// Export `Document`
export interface RecipeDocument extends Recipe, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export const Recipes =
  mongoose.model<RecipeDocument>('Recipe', recipeSchema)
