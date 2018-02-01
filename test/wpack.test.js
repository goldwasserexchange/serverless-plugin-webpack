const path = require('path');
const wpack = require('../src/lib/wpack');
const fns = require('./fns.js');

jest.mock('webpack');

const config = {
  externals: [/aws-sdk/],
  entry: { a: 'b.js' },
  output: { filename: '[name].js' },
};
const servicePath = '/service';
const defaultOutput = {
  libraryTarget: 'commonjs2',
  filename: '[name]',
};
const folder = '.webpack';
const configs = [
  {
    entry: {
      'functions/first/get.js': path.join(servicePath, 'functions/first/get.js'),
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(servicePath, folder),
      filename: '[name]',
    },
    externals: [/aws-sdk/],
  },
  {
    entry: {
      'functions/second/get.js': path.join(servicePath, 'functions/second/get.js'),
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(servicePath, folder),
      filename: '[name]',
    },
    externals: [/aws-sdk/],
  },
  {
    entry: {
      'functions/post.js': path.join(servicePath, 'functions/post.js'),
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(servicePath, folder),
      filename: '[name]',
    },
    externals: [/aws-sdk/],
  },
];

test('createConfigs', () => {
  expect(wpack.createConfigs(fns, config, servicePath, defaultOutput, folder)).toEqual(configs);
});

describe('run', () => {
  require('webpack'); // eslint-disable-line global-require, import/no-unresolved

  test('run', () =>
    wpack.run('config', config)
      .then(stats => expect(stats.data).toBe('config')));

  test('run with error', () =>
    wpack.run('err', config)
      .catch(err => expect(err.message).toMatch(/err/)));

  test('run with stats error', () =>
    wpack.run('statsError', config)
      .catch(err => expect(err.message).toMatch(/stats/)));
});
