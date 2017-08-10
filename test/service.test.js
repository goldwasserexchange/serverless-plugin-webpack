const path = require('path');
const service = require('../src/lib/service');
const fns = require('./fns.js');

const expectedPackage = {
  individually: true,
  exclude: ['**'],
};

test('service package when package is undefined', () => {
  expect(service.setPackage(undefined)).toEqual(expectedPackage);
});

test('service package when package is an empty object', () => {
  expect(service.setPackage({})).toEqual(expectedPackage);
});

test('service package with existing package and no include/exclude', () => {
  const existingPackage = {
    individually: false,
  };
  expect(service.setPackage(existingPackage)).toEqual(expectedPackage);
});

test('service package with existing package and undefined include/exclude', () => {
  const existingPackage = {
    individually: false,
    include: undefined,
    exclude: undefined,
  };
  expect(service.setPackage(existingPackage)).toEqual(expectedPackage);
});

test('service package with existing package and include/exclude', () => {
  const existingPackage = {
    individually: false,
    include: ['node_modules/**'],
    exclude: ['*.txt'],
  };
  const expectedPackageIncExc = {
    individually: true,
    include: ['../node_modules/**'],
    exclude: ['../*.txt', '**'],
  };
  expect(service.setPackage(existingPackage)).toEqual(expectedPackageIncExc);
});

test('fnPath', () => {
  expect(service.fnPath(fns.firstGet)).toBe('functions/first/get.js');
});

test('setFnsPackage', () => {
  const modifiedFns = {
    firstGet: {
      handler: 'functions/first/get.handler',
      package: {
        include: ['../node_modules/**', 'functions/first/get.js'],
        exclude: ['../abc.js'],
      },
    },
    secondGet: {
      handler: 'functions/second/get.handler',
      package: {
        include: ['functions/second/get.js'],
      },
    },
    post: {
      handler: 'functions/post.handler',
      package: {
        include: ['functions/post.js'],
        exclude: ['../*.sql', '!../test.sql'],
      },
    },
  };
  expect(service.setFnsPackage(fns)).toEqual(modifiedFns);
});

test('setArtifacts', () => {
  const artifactFns = {
    firstGet: { package: { artifact: '/.serverless/.webpack/service-dev-firstGet.zip' } },
    secondGet: { package: { artifact: '/.serverless/.webpack/service-dev-secondGet.zip' } },
    post: { package: { artifact: '/.serverless/.webpack/service-dev-post.zip' } },
  };

  const modifiedArtifactFns = {
    firstGet: { package: { artifact: path.join('/.serverless', 'service-dev-firstGet.zip') } },
    secondGet: { package: { artifact: path.join('/.serverless', 'service-dev-secondGet.zip') } },
    post: { package: { artifact: path.join('/.serverless', 'service-dev-post.zip') } },
  };
  expect(service.setFnsArtifacts('/.serverless', artifactFns)).toEqual(modifiedArtifactFns);
});
