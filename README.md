# Serverless Plugin Webpack

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-plugin-webpack.svg)](https://badge.fury.io/js/serverless-plugin-webpack)
[![Build Status](https://travis-ci.org/goldwasserexchange/serverless-plugin-webpack.svg?branch=master)](https://travis-ci.org/goldwasserexchange/serverless-plugin-webpack)
[![Coverage Status](https://coveralls.io/repos/github/goldwasserexchange/serverless-plugin-webpack/badge.svg?branch=master)](https://coveralls.io/github/goldwasserexchange/serverless-plugin-webpack?branch=master)
[![dependencies](https://david-dm.org/goldwasserexchange/serverless-plugin-webpack.svg)](https://www.npmjs.com/package/serverless-plugin-webpack)
[![Greenkeeper badge](https://badges.greenkeeper.io/goldwasserexchange/serverless-plugin-webpack.svg)](https://greenkeeper.io/)

A [serverless](http://www.serverless.com) plugin to **automatically** bundle your functions **individually** with [webpack](https://webpack.js.org).

Compared to other webpack/optimization plugins, this plugin has the following features/advantages:
- Zero configuration
- Supports `sls package`, `sls deploy` and `sls deploy function`
- Functions are packaged individually, resulting in Lambda deployment packages (zip) containing only the code needed to run the function (no bloat)
- Uses an *array* of webpack configurations instead of one webpack configuration with multiple entry points, resulting in better tree-shaking because dependencies are isolated (see [Tree shaking](https://github.com/FormidableLabs/formidable-playbook/blob/master/docs/frontend/webpack-tree-shaking.md)).

This plugin is partially based on [Serverless Webpack](https://github.com/elastic-coders/serverless-webpack).

## Install
Using npm:
```
npm install serverless-plugin-webpack --save-dev
```

Add the plugin to your `serverless.yml` file:
```yaml
plugins:
  - serverless-plugin-webpack
```

## Package exclude / include
The plugin will add `'**'` as an `exclude` at the service level and each bundled javascript file as an `include` at the function level. Original includes and excludes specified in your `serverless.yml` are preserved.

## Webpack configuration
By default the plugin will look for a `webpack.config.js` in the service root. You can specify a custom config file in your `serverless.yml`:
```yaml
custom:
  webpack:
    config: ./path/to/config/file.js
```

The `entry` and `output` objects are set by the plugin.

Example of webpack config:
```javascript
module.exports = {
  // entry: set by the plugin
  // output: set by the plugin
  target: 'node',
  externals: [
    /aws-sdk/, // Available on AWS Lambda
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'env',
              {
                target: { node: '6.10' }, // Node version on AWS Lambda
                useBuiltIns: true,
                modules: false,
                loose: true,
              },
            ],
            'stage-0',
          ],
        },
      },
    ],
  },
};
```

If you want to further optimize the bundle and are using ES6 features, you can use the [UglifyJS Webpack Plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) together with the harmony branch of [UglifyJS 2](https://github.com/mishoo/UglifyJS2#harmony) or the [Babili Webpack Plugin](https://github.com/webpack-contrib/babili-webpack-plugin).
