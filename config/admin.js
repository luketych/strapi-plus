const config = require('./index');

module.exports = () => ({
  auth: {
    secret: config.security.adminJwtSecret,
  },
  apiToken: {
    salt: config.security.apiTokenSalt,
  },
  transfer: {
    token: {
      salt: config.security.transferTokenSalt,
    },
  },
  flags: {
    nps: true,
    promoteEE: true,
  },
});
