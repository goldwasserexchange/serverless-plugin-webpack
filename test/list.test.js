const list = require('../src/lib/list');

test('list', () => {
  expect(list('test')).toEqual(['test']);
});
