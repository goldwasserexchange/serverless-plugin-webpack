const fs = require('fs-extra');
const path = require('path');
const functions = require('./lib/functions');
const wpack = require('./lib/wpack');

// Folders
const serverlessFolder = '.serverless';
const webpackFolder = '.webpack';

// Webpack default output
const webpackDefaultOutput = {
  libraryTarget: 'commonjs2',
  filename: '[name]',
};

class ServerlessPluginWebpack {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:package:createDeploymentArtifacts': this.beforeCreateDeploymentArtifacts.bind(this),
      'after:package:createDeploymentArtifacts': this.afterCreateDeploymentArtifacts.bind(this),
    };
  }

  beforeCreateDeploymentArtifacts() {
    this.serverless.cli.log('Bundling with webpack...');

    // Load webpack config
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const webpackConfig = require(path.join(this.serverless.config.servicePath, 'webpack.config.js'));

    // Save original service path and functions
    this.originalServicePath = this.serverless.config.servicePath;
    this.originalFunctions = this.serverless.service.functions;

    // Fake service path so that serverless will know what to zip
    this.serverless.config.servicePath = path.join(this.originalServicePath, webpackFolder);

    // Package individually and exclude everything at the service level
    this.serverless.service.package = {
      individually: true,
      exclude: ['*'],
    };

    // Include bundle and update handler at function level
    this.serverless.service.functions = functions.setPackageAndHandler(
      this.serverless.service.functions
    );

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
          this.serverless.service.functions = functions.setArtifacts(
            path.join(this.originalServicePath, serverlessFolder),
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
