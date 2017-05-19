const path = require('path');
const service = require('../src/lib/service');
const fns = require('./fns.js');

test('service package when no package', () => {
  const expectedPackage = {
    individually: true,
    exclude: ['**'],
  };
  expect(service.setPackage({})).toEqual(expectedPackage);
});

test('service package with existing package and no include/exclude', () => {
  const existingPackage = {
    individually: false,
  };
  const expectedPackage = {
    individually: true,
    exclude: ['**'],
  };
  expect(service.setPackage(existingPackage)).toEqual(expectedPackage);
});

test('service package with existing package and include/exclude', () => {
  const existingPackage = {
    individually: false,
    include: ['node_modules/**'],
    exclude: ['*.txt'],
  };
  const expectedPackage = {
    individually: true,
    include: ['node_modules/**'],
    exclude: ['*.txt', '**'],
  };
  expect(service.setPackage(existingPackage)).toEqual(expectedPackage);
});

test('fnPath', () => {
  expect(service.fnPath(fns.firstGet)).toBe('functions/first/get.js');
});

test('setFnsPackage', () => {
  const modifiedFns = {
    firstGet: {
      handler: 'functions/first/get.handler',
      package: {
        include: ['node_modules/**', 'functions/first/get.js'],
        exclude: ['abc.js'],
      },
    },
    secondGet: {
      handler: 'functions/second/get.handler',
      package: {
        include: ['node_modules/**', 'functions/second/get.js'],
        exclude: ['abc.js'],
      },
    },
    post: {
      handler: 'functions/post.handler',
      package: {
        include: ['functions/post.js'],
        exclude: ['*.sql'],
      },
    },
  };
  expect(service.setFnsPackage(fns)).toEqual(modifiedFns);
});

test('setArtifacts', () => {
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
  expect(service.setFnsArtifacts('/.serverless', artifactFns)).toEqual(modifiedArtifactFns);
});
