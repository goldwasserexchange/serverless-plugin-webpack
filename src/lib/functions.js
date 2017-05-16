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
    R.merge(
        R.objOf('exclude', ['**']),
        R.objOf(
            'include',
            R.compose(list, handlerPath, handlerProp)(fn)
        )
    ),
    fn
);

const setHandler = (fn, funcName) => R.over(R.lensProp('handler'), R.compose(R.concat(funcName + "/"), path.basename))(fn);

const setPackageAndHandler = R.mapObjIndexed(R.compose(setPackage, setHandler));

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
