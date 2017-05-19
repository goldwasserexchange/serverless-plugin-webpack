const path = require('path');
const R = require('ramda');

const appendPath = (p, e) => R.over(R.lensPath(p), R.append(e));

const setPackage = R.pipe(
  R.over(R.lensProp('exclude'), R.append('**')),
  R.assoc('individually', true)
);

const fnPath = R.compose(R.replace(/\.[^.]+$/, '.js'), R.prop('handler'));

const setFnsPackage = R.map(fn => appendPath(['package', 'include'], fnPath(fn))(fn));

const setFnsArtifacts = (serverlessPath, fns) => R.map(
  R.over(
    R.lensProp('artifact'),
    artifact => path.join(serverlessPath, path.basename(artifact))
  ),
  fns
);

module.exports = {
  setPackage,
  fnPath,
  setFnsPackage,
  setFnsArtifacts,
};
