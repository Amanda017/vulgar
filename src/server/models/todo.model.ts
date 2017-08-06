// ```
// todo.model.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// todo.model.ts may be freely distributed under the MIT license
// ```
'use strict'

/*
 * Todo Model
 * Note: MongoDB will autogenerate an `_id` for each `Recipe` object
 * created.
 */

/*
 * Imports
 */

// Grab the Mongoose module
import mongoose = require('mongoose')

const Schema = mongoose.Schema


/**
 * Interface representing abstract Todo.
 */
interface ITodo {
  text: string
}


/**
 * Concrete Todo class.
 * @see ITodo
 */
export class Todo implements ITodo {
  text: string


  /**
   * Creates and returns a new instance of this class.
   * @param {ITodo} data Data from which to source the data for
   * the new Todo instance.
   */
  constructor(data: ITodo) {
    this.text = data.text
  }
}


/**
 * Todo Schema.
 * @type {"mongoose".Schema}
 */
const todoSchema = new Schema({
  text: { required: true, type : String }
})


/**
 * Exports
 */

// Export `Document`.
export interface TodoDocument extends Todo, mongoose.Document { }

// Expose the `model` so that it can be imported and used in the
// controller (to search, delete, etc.)
export const Todos = mongoose.model<TodoDocument>('Todo', todoSchema)
