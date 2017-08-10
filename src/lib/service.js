const path = require('path');
const R = require('ramda');

const makeRelative = R.replace(/[^!]+$/, R.concat('../'));
const makeAllRelative = p => R.when(R.prop(p), R.over(R.lensProp(p), R.map(makeRelative)));
const makePackageRelative = R.compose(makeAllRelative('include'), makeAllRelative('exclude'));

const setPackage = R.pipe(
  R.defaultTo({}),
  makePackageRelative,
  R.over(R.lensProp('exclude'), R.append('**')),
  R.assoc('individually', true)
);

const fnPath = R.compose(R.replace(/\.[^.]+$/, '.js'), R.prop('handler'));

const setFnsPackage = R.map(
  R.pipe(
    R.when(R.prop('package'), R.over(R.lensProp('package'), makePackageRelative)),
    R.converge(
      R.over(R.lensPath(['package', 'include'])),
      [R.compose(R.append, fnPath), R.identity]
    )
  )
);

const setFnsArtifacts = (serverlessPath, fns) => R.map(
  R.over(
    R.lensPath(['package', 'artifact']),
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
