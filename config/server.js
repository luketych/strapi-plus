const config = require('./index');

module.exports = () => ({
  host: config.server.host,
  port: config.server.port,
  app: {
    keys: config.security.appKeys,
  },
  webhooks: {
    populateRelations: false,
  },
});
