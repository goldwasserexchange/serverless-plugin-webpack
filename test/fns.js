const originalFns = {
  firstGet: {
    handler: 'functions/first/get.handler',
    package: {
      include: ['*'],
      exclude: ['abc.js'],
    },
  },
  secondGet: {
    handler: 'functions/second/get.handler',
    package: {
      include: ['*'],
      exclude: ['abc.js'],
    },
  },
  post: {
    handler: 'functions/post.handler',
    package: { exclude: ['*.js'] },
  },
};

module.exports = originalFns;
