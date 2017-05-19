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
    package: {
      include: ['node_modules/**'],
      exclude: ['abc.js'],
    },
  },
  post: {
    handler: 'functions/post.handler',
    package: { exclude: ['*.sql'] },
  },
};

module.exports = originalFns;
