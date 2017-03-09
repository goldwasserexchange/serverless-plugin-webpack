const fs = require('fs-extra');
const path = require('path');
const R = require('ramda');
const webpack = require('webpack');

// Folders
const serverlessFolder = '.serverless';
const webpackFolder = '.webpack';

// Webpack default output
const webpackDefaultOutput = {
  libraryTarget: 'commonjs2',
  filename: '[name]',
};

// Utils
const list = R.unapply(R.identity);
const handlerExport = R.compose(R.last, R.split('.'));
const handlerPath = handler => R.replace(handlerExport(handler), 'js', handler);
const handlerFile = R.compose(path.basename, handlerPath);
const filename = R.compose(handlerFile, R.prop('handler'));
const handlerModifiedExport = handler => R.replace('js', handlerExport(handler), handlerFile(handler));

class ServerlessPluginWebpack {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:deploy:createDeploymentArtifacts': this.beforeCreateDeploymentArtifacts.bind(this),
      'after:deploy:createDeploymentArtifacts': this.afterCreateDeploymentArtifacts.bind(this),
    };
  }

  beforeCreateDeploymentArtifacts() {
    this.serverless.cli.log('Bundling with webpack...');

    // Load webpack config
    const webpackConfig = require(path.join(this.serverless.config.servicePath, 'webpack.config.js')); // eslint-disable-line

    // Save original service path
    this.originalServicePath = this.serverless.config.servicePath;

    // Fake service path so that serverless will know what to zip
    this.serverless.config.servicePath = path.join(this.originalServicePath, webpackFolder);

    // Create list of webpack configs
    const configs = R.map(
      fn =>
        R.pipe(
          R.assoc( // Set webpack entry
            'entry',
            R.objOf(
              filename(fn),
              path.join(this.originalServicePath, handlerPath(fn.handler))
            )
          ),
          R.assoc(// Set output
            'output',
            R.merge(
              webpackDefaultOutput,
              { path: path.join(this.originalServicePath, webpackFolder) }
            )
          )
        )(Object.assign({}, webpackConfig)), // Clone original config
      R.values(this.serverless.service.functions)
    );

    // Package individually and exclude everything at the service level
    this.serverless.service.package = {
      individually: true,
      exclude: ['*'],
    };

    // Include bundle and update handler at function level
    this.serverless.service.functions = R.map(
      R.pipe(
        fn => R.assocPath(
          ['package', 'include'],
          R.compose(list, handlerFile, R.prop('handler'))(fn),
          fn
        ),
        R.over(R.lensProp('handler'), handlerModifiedExport)
      ),
      this.serverless.service.functions
    );

    // Run webpack
    return new Promise((resolve, reject) => {
      webpack(configs, (err, stats) => {
        if (err) reject(`Webpack compilation error: ${err}`);

        // Log webpack stats
        this.serverless.cli.consoleLog(stats.toString({
          colors: true,
          hash: false,
          chunks: false,
          version: false,
        }));

        if (stats.hasErrors()) reject('Webpack compilation error, see stats above');

        resolve();
      });
    });
  }

  afterCreateDeploymentArtifacts() {
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath;

    // Copy .webpack to .serverless
    return new Promise((resolve, reject) => {
      fs.copy(
        path.join(this.originalServicePath, webpackFolder, serverlessFolder),
        path.join(this.originalServicePath, serverlessFolder),
        (err) => {
          if (err) reject(err);

          // Update artifacts path
          this.serverless.service.functions = R.map(
            R.over(
              R.lensProp('artifact'),
              a => path.join(this.originalServicePath, serverlessFolder, path.basename(a))
            ),
            this.serverless.service.functions
          );

          // Remove webpack folder
          fs.removeSync(path.join(this.originalServicePath, webpackFolder));

          resolve();
        }
      );
    });
  }
}

module.exports = ServerlessPluginWebpack;
