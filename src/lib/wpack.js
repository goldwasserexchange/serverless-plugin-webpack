const path = require('path');
const R = require('ramda');
const webpack = require('webpack'); // eslint-disable-line import/no-unresolved
const functions = require('./functions');

/**
 * Sets webpack entry
 * @param {object} fn Serverless function object
 * @param {string} servicePath Serverless service path
 * @returns {object} Webpack configuration
 */
const setEntry = (fn, servicePath) =>
R.assoc(
  'entry',
  R.objOf(
    functions.fnFilename(fn),
    path.join(servicePath, functions.fnPath(fn))
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
 * @returns {array} Array of webpack configurations
 */
const createConfigs = (fns, config, servicePath, defaultOutput, folder) =>
R.map(
  funcName =>
R.pipe(
  setEntry(fns[funcName], servicePath),
  setOutput(defaultOutput, path.join(servicePath, folder, funcName))
)(config),
  R.keys(fns)
);

/**
 * Runs webpack with an array of configurations
 * @param {array} configs Array of webpack configurations
 * @returns {Promise} Webpack stats
 */
const run = configs =>
new Promise((resolve, reject) => {
  webpack(configs, (err, stats) => {
    if (err) reject(`Webpack compilation error: ${err}`);

    console.log(stats.toString({ // eslint-disable-line no-console
      colors: true,
      hash: false,
      chunks: false,
      version: false,
    }));

    if (stats.hasErrors()) reject('Webpack compilation error, see stats above');

    resolve(stats);
  });
});

module.exports = {
  createConfigs,
  run,
};
