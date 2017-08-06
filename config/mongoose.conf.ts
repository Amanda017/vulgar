// ```
// mongoose.conf.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// mongoose.conf.js may be freely distributed under the MIT license
// ```

/*
 * Imports
 */

import {Mongoose, MongooseThenable} from 'mongoose';
const mongoose = require('mongoose');


// Debug logging utility.
import { IDebug } from 'debug';
const debug: IDebug = require('debug')(`app:mongoose`);


/**
 * Configure disconnection handler.
 * @return {MongooseThenable}
 */
export function terminateMongooseConnection(): MongooseThenable {
  return mongoose.disconnect(() => {
    debug(`Mongoose connection has disconnected through app `
      + `termination`);
  });
}


/**
 *  Connect to our MongoDB database using the MongoDB connection URI
 *  from our predefined environment variable.
 * @param {Mongoose} m Reference to a `Mongoose` instance.
 */
export function connectToMongo(m: Mongoose): void {
  m.connect(process.env.MONGO_URI,
    { useMongoClient: true },
    (error) => {
      if (error)
        throw error;
    }
  );
}


/**
 * Configure `Mongoose` instance.
 * @param {Mongoose} m Reference to `Mongoose` instance to configure.
 */
export default function mongooseConf(m: Mongoose): void {

  // Use native promises
  m.Promise = global.Promise;

  m.connection.on('connected', (ref: any) => {
    debug(`Successfully connected to ${process.env.NODE_ENV} database `
      + `on startup`);
  });

  // If the connection throws an error
  m.connection.on('error', (err: any) => {
    debug(`Failed to connect to ${process.env.NODE_ENV} database on `
      + `startup!`);
    // Don't send `process.exit(1)` in this case since `Mongoose` will
    // handle it
    if (process.env.NODE_ENV === 'development'
      || process.env.NODE_ENV === 'test')
      debug(`Error: ${err}`);
  });

  // When the connection is disconnected
  m.connection.on('disconnected', () => {
    debug(`Mongoose default connection to ${process.env.NODE_ENV} `
      + `database disconnected`);
  });

}
