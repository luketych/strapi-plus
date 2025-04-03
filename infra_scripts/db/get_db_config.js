// scripts/db/get_db_config.js
const dbConfigFactory = require('../../config/database');
const dbConfig = dbConfigFactory().connection.connection;

console.log(JSON.stringify({
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password,
}));