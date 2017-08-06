/**
 * Helpers
 */
import helpers from './helpers.utils';

// Debug logging utility.
const debug = require('debug')(`app:gulp`);

/**
 * Gulp packages
 */
import gulp from 'gulp';
import nodemon from 'nodemon';
import path from 'path';
import scsslint from 'gulp-scss-lint';
import webpack from 'webpack';

/**
 * Development webpack configuration
 */
const developmentConfig = require('./webpack/server.dev');

/**
 * Production webpack configuration
 */
const productionConfig = require('./webpack/server.prod');

/**
 * Test webpack configuration
 */
const testConfig = require('./webpack/server.test');

/**
 * File globs for use during documentation generation with Docco
 * @type {Object}
 */
const globs = {
  sass: ['src/client/**/*.scss']
};

/**
 * Termination handler.
 * Ensures task runners terminate after finishing.
 */
function exitHandler() {
  process.exit(0);
}
process.once('SIGINT', exitHandler);


/**
 * Webpack Tasks
 */

/**
 * Task for displaying build output.
 */
function onBuild(done) {
  return function(error, stats) {
    if(error)
      console.error('Error: ', error);
    else {
      console.info(stats.toString());
    if(done)
      done();
    }
  }
}

/**
 * Create the default task which is just a wrapper for the `serve` task.
 */
gulp.task('default', ['serve']);

/**
 * Gulp task wrapper for build:server:dev task
 */
gulp.task('build:server', ['build:server:dev']);

/**
 * Gulp task wrapper for watch:server:dev task
 */
gulp.task('watch:server', ['watch:server:dev']);

/**
 * Gulp task for building the server using the development configuration
 */
gulp.task('build:server:dev', (done) => {
  // You can pass a `config` object to `webpack` and get
  // back a compiler. From there, you can call `run` or
  // `watch` on the compiler.
  webpack(developmentConfig()).run(onBuild(done));
});

/**
 * Task for watching the server files builds when changes are detected.
 */
gulp.task('watch:server:dev', () => {
  // The first argument is a delay
  webpack(developmentConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

/**
 * Task for building the server using the production configuration
 */
gulp.task('build:server:prod', (done) => {
  webpack(productionConfig()).run(onBuild(done));
});

/**
 * Task for watching server files. Builds when changes are detected.
 */
gulp.task('watch:server:prod', () => {
  webpack(productionConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

/**
 * Task for building the server using the test configuration
 */
gulp.task('build:server:test', (done) => {
  webpack(testConfig()).run(onBuild(done));
});

/**
 * Task for watching server files. Builds when changes are
 * detected.
 */
gulp.task('watch:server:test', () => {
  webpack(testConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
});


/**
 * Nodemon Configuration
 */

/**
 * This task watches the files belonging to the server app for changes.
 * When a change is detected the `watch:backend` task will be
 * automatically fired, which will allow `webpack` to recompile the
 * server code. After this is complete `nodemon` will restart the
 * server.
 */
gulp.task('serve', ['build:server', 'watch:server'], () => {

  nodemon({

    execMap: {
      js: 'node'
    },

    script: path.join(helpers.root('dist/server'), 'server.bundle'),

    /**
     * We don't actually want `nodemon`'s watcher to watch anything.
     * That is why we pass `ignore` `*` and give `watch` a non-existant
     * directory.
     */
    ignore: ['*'],

    watch: ['foo/'],

    ext: 'noop'

  }).on('restart', () => {
    debug('Changes detected; restarting server...')
  });

});


/**
 * SASS tasks
 */

/**
 * Task for linting Sass stylesheets.
 */
gulp.task('lint:sass', () => {
  return gulp.src(globs.sass)
    .pipe(scsslint());
});

/**
 * Gulp task that watches Sass stylesheets and lints on file change.
 */
gulp.task('watch:sass', () => {
  gulp.watch(globs.sass, function (event) {
    return gulp.src(event.path)
      .pipe(scsslint());
  });
});
