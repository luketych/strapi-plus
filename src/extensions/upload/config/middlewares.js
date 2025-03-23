'use strict';

module.exports = {
  settings: {
    cors: {
      enabled: true,
    },
  },
  routes: {
    prefix: '/api',
  },
  middlewares: [
    {
      name: 'upload-middleware',
      config: {},
    },
  ],
}; 