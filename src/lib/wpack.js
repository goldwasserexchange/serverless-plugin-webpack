const path = require('path');
const R = require('ramda');
const webpack = require('webpack'); // eslint-disable-line import/no-unresolved
const service = require('./service');

/**
 * Sets webpack entry
 * @param {object} fn Serverless function object
 * @param {string} servicePath Serverless service path
 * @param {boolean} useTypeScript Use .ts extension
 * @returns {object} Webpack configuration
 */
const setEntry = (fn, servicePath, useTypeScript) =>
  R.assoc(
    'entry',
    R.objOf(
      service.fnPath('.js')(fn),
      path.join(servicePath, service.fnPath(useTypeScript ? '.ts' : '.js')(fn))
    )
  );

/**
 * Sets webpack output in configuration
 * @param {object} defaultOutput Webpack default output object
 * @param {string} outputPath Webpack output path
 * @returns {object} Webpack configuration
 */
const setOutput = (defaultOutput, outputPath) =>
  R.assoc(
    'output',
    R.merge(
      defaultOutput,
      { path: outputPath }
    )
  );

/**
 * Creates an array of webpack configurations
 * @param {object} fns Serverless functions object
 * @param {object} config Webpack config
 * @param {string} servicePath Serverless service path
 * @param {object} defaultOutput Webpack default output object
 * @param {string} folder Webpack output folder
 * @param {boolean} useTypeScript Use .ts extension
 * @returns {array} Array of webpack configurations
 */
const createConfigs = (fns, config, servicePath, defaultOutput, folder, useTypeScript) =>
  R.map(
    fn =>
      R.pipe(
        setEntry(fn, servicePath, useTypeScript),
        setOutput(defaultOutput, path.join(servicePath, folder))
      )(config),
    R.values(fns)
  );

/**
 * Runs webpack with an array of configurations
 * @param {array} configs Array of webpack configurations
 * @returns {Promise} Webpack stats
 */
const run = configs =>
  new Promise((resolve, reject) => {
    webpack(configs, (err, stats) => {
      if (err) reject(new Error(`Webpack compilation error: ${err}`));

      // eslint-disable-next-line no-console
      console.log(stats.toString(configs[0].stats ? configs[0].stats : {
        colors: true,
        hash: false,
        chunks: false,
        version: false,
      }));

      if (stats.hasErrors()) reject(new Error('Webpack compilation error, see stats above'));

      resolve(stats);
    });
  });

module.exports = {
  createConfigs,
  run,
};
