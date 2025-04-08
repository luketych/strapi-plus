const path = require('path');
const config = require('./index');

module.exports = () => {
  const client = config.database.client;

  const connections = {
    postgres: {
      connection: {
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        user: config.database.username,
        password: config.database.password,
        ssl: false,
        schema: 'public',
      },
      pool: { min: 2, max: 10 },
    }
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: 60000,
    },
  };
};
