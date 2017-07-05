const originalFns = {
  firstGet: {
    handler: 'functions/first/get.handler',
    package: {
      include: ['node_modules/**'],
      exclude: ['abc.js'],
    },
  },
  secondGet: {
    handler: 'functions/second/get.handler',
  },
  post: {
    handler: 'functions/post.handler',
    package: { exclude: ['*.sql', '!test.sql'] },
  },
};

module.exports = originalFns;
