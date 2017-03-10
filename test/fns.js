const originalFns = {
  get: {
    handler: 'functions/first/get.handler',
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
