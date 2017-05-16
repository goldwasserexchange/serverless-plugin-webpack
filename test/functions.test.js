const path = require('path');
const functions = require('../src/lib/functions');
const fns = require('./fns.js');

const modifiedFns = {
  get: {
    handler: 'get/get.handler',
    package: { exclude: ['**'], include: ['get/get.js'] },
  },
  post: {
    handler: 'post/post.handler',
    package: { exclude: ['**'], include: ['post/post.js'] },
  },
};

const artifactFns = {
  get: { artifact: '/.serverless/.webpack/service-dev-get.zip' },
  post: { artifact: '/.serverless/.webpack/service-dev-post.zip' },
};

const modifiedArtifactFns = {
  get: { artifact: path.join('/.serverless', 'service-dev-get.zip') },
  post: { artifact: path.join('/.serverless', 'service-dev-post.zip') },
};

test('fnPath', () => {
  expect(functions.fnPath(fns.get)).toBe('functions/first/get.js');
});

test('fnFilename', () => {
  expect(functions.fnFilename(fns.post)).toBe('post.js');
});

test('setPackageAndHandler', () => {
  expect(functions.setPackageAndHandler(fns)).toEqual(modifiedFns);
});

test('setArtifacts', () => {
  expect(functions.setArtifacts('/.serverless', artifactFns)).toEqual(modifiedArtifactFns);
});
