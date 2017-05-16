const path = require('path');
const R = require('ramda');
const list = require('./list');

const handlerProp = R.prop('handler');

const handlerPath = R.replace(/\.[^.]+$/, '.js');
const handlerFile = R.compose(path.basename, handlerPath);
const fnPath = R.compose(handlerPath, handlerProp);
const fnFilename = R.compose(handlerFile, handlerProp);

const setPackage = fn =>
  R.assoc(
    'package',
    R.objOf(
      'include',
      R.compose(list, fnFilename)(fn)
    ),
    fn
  );

const setHandler = R.over(R.lensProp('handler'), path.basename);

const setPackageAndHandler = R.map(R.compose(setHandler, setPackage));

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
