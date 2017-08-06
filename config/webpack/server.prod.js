/**
 * Server Webpack Production Configuration
 */

import fs from 'fs';
import webpack from 'webpack';

/**
 * Helpers
 */
const helpers = require('../helpers.utils');

/**
 * Webpack Merge
 */
const webpackMerge = require('webpack-merge');

/**
 * Common webpack configuration for development and production
 */
const commonConfig = require('./server.common.js');

/**
 * Webpack Plugins
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

let nodeModules = {};

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

const BUNDLE_ANALYZER_PORT = 8888;
const BUNDLE_ANALYZER_HOST = '127.0.0.1';


module.exports = function(options) {

  return webpackMerge(commonConfig({ env: ENV }), {

    target: 'node',

    output: {

      /**
       * The output directory as absolute path (required)
       *
       * @see http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist/server'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * @see http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].[chunkhash].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files
       * They are inside the output.path directory
       *
       * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].[chunkhash].bundle.map',

      /**
       * The filename of non-entry chunks as relative path inside the
       * output.path directory
       *
       * @see http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].[chunkhash].chunk.js'

    },

    // Tell `webpack` that you want to preserve the values of `__dirname` and
    // `__filename`
    node: {
      __dirname: true,
      __filename: true
    },

    externals: nodeModules,

    plugins: [

      /**
       * Plugin: DedupePlugin
       * Description: Prevents the inclusion of duplicate code into your bundle
       * and instead applies a copy of the function at runtime.
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       * @see https://github.com/webpack/docs/wiki/optimization#deduplication
       */
      new DedupePlugin(),

      /**
       * Plugin: CompressionPlugin
       * Description: Prepares compressed versions of assets to serve
       * them with Content-Encoding
       *
       * @see https://github.com/webpack/compression-webpack-plugin
       *
       * NOTE: install compression-webpack-plugin
       */
      // new CompressionPlugin({
      //   regExp: /\.js$|\.map$/,
      //   threshold: 2 * 1024
      // }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * @see: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: false,
        options: {

          /**
           * Static analysis linter for TypeScript advanced options configuration
           * Description: An extensible linter for the TypeScript language
           *
           * @see https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: true,
            failOnHint: true,
            resourcePath: 'src/server'
          }
        }
      }),

      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks
       * Loaders are switched into minimizing mode
       *
       * @see https:*webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       * NOTE: To debug prod builds uncomment //debug lines and comment
       * //prod lines
       */
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, //debug
        // comments: true, //debug

        mangle: {
          screw_ie8: true,
          keep_fnames: true
        }, //prod
        compress: {
          screw_ie8: true
        }, //prod
        comments: false //prod
      }),

      /**
       * Plugin: WebpackMd5Hash
       * Description: Plugin to replace a standard webpack chunkhash with md5
       *
       * @see https://www.npmjs.com/package/webpack-md5-hash
       */
      new WebpackMd5Hash(),

      new HashedModuleIdsPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),

      /**
       * Plugin: CompressionPlugin
       * Description: Prepares compressed versions of assets to serve
       * them with Content-Encoding
       *
       * See: https://github.com/webpack/compression-webpack-plugin
       */
      new CompressionPlugin({
        regExp: /\.js$|\.map$/,
        threshold: 2 * 1024
      }),

      /**
       * Plugin: BundleAnalyzerPlugin
       * Description: Webpack plugin and CLI utility that represents
       * bundle content as convenient interactive zoomable treemap
       *
       * `npm run build:prod -- --env.analyze` to use
       *
       * See: https://github.com/th0r/webpack-bundle-analyzer
       */
      new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'server',
        // Host that will be used in `server` mode to start HTTP server.
        analyzerHost: BUNDLE_ANALYZER_HOST,
        // Port that will be used in `server` mode to start HTTP server.
        analyzerPort: BUNDLE_ANALYZER_PORT,
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        // Module sizes to show in report by default.
        // Should be one of `stat`, `parsed` or `gzip`.
        // See "Definitions" section for more information.
        defaultSizes: 'parsed',
        // Automatically open report in default browser
        openAnalyzer: true,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: true,
        // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
        // Relative to bundles output directory.
        statsFilename: 'stats.json',
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules from stats file with `source: false` option.
        // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        logLevel: 'info'
      }),

      /**
       * Plugin: IgnorePlugin
       * Description: Don't generate modules for requests matching the provided RegExp
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
       */
      new webpack.IgnorePlugin(/\.(css|scss|less)$/),

      /**
       * Plugin: BannerPlugin
       * Description: Adds a banner to the top of each generated chunk
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
       */
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })

    ]

  })

}
