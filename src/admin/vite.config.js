const { mergeConfig } = require('vite');
require('dotenv').config(); // 🔁 Load .env variables

module.exports = (config) => {
  // Parse comma-separated allowed hosts into an array
  const allowedHosts = process.env.VITE__SERVER_ALLOWED_HOSTS?.split(',').map(h => h.trim()) || [];

  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      allowedHosts,
    },
  });
};