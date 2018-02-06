// Webpack mock
module.exports = (configs, callback) => {
  if (configs === 'err') return callback('err');

  const stats = {
    data: configs,
    hasErrors: () => configs === 'statsError',
    toString: jest.fn(),
  };

  return callback(null, stats);
};
