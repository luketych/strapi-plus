module.exports = {
  // Development-specific overrides
  database: {
    // When running locally without Docker, use localhost
    host: process.env.DATABASE_HOST || 'localhost',
    // Other database settings from default config
  }
};
