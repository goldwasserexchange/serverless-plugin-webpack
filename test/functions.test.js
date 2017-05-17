const path = require('path');
const functions = require('../src/lib/functions');
const fns = require('./fns.js');

const modifiedFns = {
  firstGet: {
    handler: 'functions/first/get.handler',
    package: { include: ['functions/first/get.js'] },
  },
  secondGet: {
    handler: 'functions/second/get.handler',
    package: { include: ['functions/second/get.js'] },
  },
  post: {
    handler: 'functions/post.handler',
    package: { include: ['functions/post.js'] },
  },
};

const artifactFns = {
  firstGet: { artifact: '/.serverless/.webpack/service-dev-firstGet.zip' },
  secondGet: { artifact: '/.serverless/.webpack/service-dev-secondGet.zip' },
  post: { artifact: '/.serverless/.webpack/service-dev-post.zip' },
};

const modifiedArtifactFns = {
  firstGet: { artifact: path.join('/.serverless', 'service-dev-firstGet.zip') },
  secondGet: { artifact: path.join('/.serverless', 'service-dev-secondGet.zip') },
  post: { artifact: path.join('/.serverless', 'service-dev-post.zip') },
};

test('fnPath', () => {
  expect(functions.fnPath(fns.firstGet)).toBe('functions/first/get.js');
});

test('setPackage', () => {
  expect(functions.setPackage(fns)).toEqual(modifiedFns);
});

test('setArtifacts', () => {
  expect(functions.setArtifacts('/.serverless', artifactFns)).toEqual(modifiedArtifactFns);
});
