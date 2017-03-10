// Webpack mock
module.exports = (configs, callback) => {
  if (configs === 'err') return callback('err');

  const stats = {
    data: configs,
    hasErrors: () => configs === 'statsError',
    toString: () => configs,
  };

  return callback(null, stats);
};
