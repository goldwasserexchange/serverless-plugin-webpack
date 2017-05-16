const path = require('path');
const R = require('ramda');
const list = require('./list');

const handlerProp = R.prop('handler');

const handlerExport = R.compose(R.last, R.split('.'));

const handlerPath = handler => R.replace(handlerExport(handler), 'js', handler);
const handlerFile = R.compose(path.basename, handlerPath);
const fnPath = R.compose(handlerPath, handlerProp);
const fnFilename = R.compose(handlerFile, handlerProp);

const setPackage = fn =>
  R.merge(
    {
      package: {
        include: R.compose(list, fnPath)(fn), // Only include the webpacked function
        exclude: ['**', '!node_modules/**'], // This excludes all files except for copied node_modules/** to the artifact
      },
    },
    fn
  );

const setPackageAndHandler = R.map(setPackage);

const setArtifacts = (serverlessPath, fns) => R.map(
  R.over(
    R.lensProp('artifact'),
    artifact => path.join(serverlessPath, path.basename(artifact))
  ),
  fns
);

module.exports = {
  fnPath,
  fnFilename,
  setPackageAndHandler,
  setArtifacts,
};
