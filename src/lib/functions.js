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
  R.assoc(
    'package',
    R.objOf(
      'include',
      R.compose(list, fnPath)(fn)
    ),
    fn
  );

const setPackageAndHandler = R.map(R.compose(setPackage));

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
