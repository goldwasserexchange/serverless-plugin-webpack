const path = require('path');
const R = require('ramda');

const handlerPath = R.replace(/\.[^.]+$/, '.js');
const fnPath = R.compose(handlerPath, R.prop('handler'));

const fnInclude = fn => R.objOf('include', [fnPath(fn), 'node_modules/**']);

const setPackage = R.map(fn => R.assoc('package', fnInclude(fn), fn));

const setArtifacts = (serverlessPath, fns) => R.map(
  R.over(
    R.lensProp('artifact'),
    artifact => path.join(serverlessPath, path.basename(artifact))
  ),
  fns
);

module.exports = {
  fnPath,
  setPackage,
  setArtifacts,
};
