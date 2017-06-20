const fs = require('fs-extra');
const path = require('path');
const R = require('ramda');
const service = require('./lib/service');
const wpack = require('./lib/wpack');

// Folders
const serverlessFolder = '.serverless';
const webpackFolder = '.webpack';

// Webpack defaults
const webpackDefaultOutput = {
  libraryTarget: 'commonjs2',
  filename: '[name]',
};
const webpackDefaultConfig = 'webpack.config.js';

class ServerlessPluginWebpack {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.custom = R.pathOr({}, ['custom', 'webpack'], this.serverless.service);
    this.hooks = {
      'before:package:createDeploymentArtifacts': () => this.webpackBundle('service'),
      'after:package:createDeploymentArtifacts': () => this.restoreAndCopy('service'),
      'before:deploy:function:packageFunction': () => this.webpackBundle('function'),
      'after:deploy:function:packageFunction': () => this.restoreAndCopy('function'),
    };
  }

  webpackBundle(type) {
    this.serverless.cli.log('Bundling with webpack...');

    // Load webpack config
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const webpackConfig = require(path.join(
      this.serverless.config.servicePath,
      this.custom.config || webpackDefaultConfig
    ));

    // Save original service path and functions
    this.originalServicePath = this.serverless.config.servicePath;
    this.originalFunctions = type === 'function'
      ? R.pick([this.options.function], this.serverless.service.functions)
      : this.serverless.service.functions;

    // Fake service path so that serverless will know what to zip
    this.serverless.config.servicePath = path.join(this.originalServicePath, webpackFolder);

    // Package individually and exclude everything at the service level
    this.serverless.service.package = service.setPackage(this.serverless.service.package);

    // Include bundle at function level
    this.serverless.service.functions = service.setFnsPackage(this.serverless.service.functions);

    // Run webpack
    return wpack.run(
      wpack.createConfigs(
        this.originalFunctions,
        webpackConfig,
        this.originalServicePath,
        webpackDefaultOutput,
        webpackFolder
      )
    );
  }

  restoreAndCopy(type) {
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath;

    // Copy .webpack/.serverless to .serverless and remove .webpack
    const src = path.join(this.originalServicePath, webpackFolder, serverlessFolder);
    const dest = path.join(this.originalServicePath, serverlessFolder);
    return fs.copy(src, dest)
      .then(() => {
        if (type === 'service') {
          this.serverless.service.functions = service.setFnsArtifacts(
            dest,
            this.serverless.service.functions
          );
        }
        return fs.remove(path.join(this.originalServicePath, webpackFolder));
      });
  }
}

module.exports = ServerlessPluginWebpack;
