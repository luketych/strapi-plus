// @ts-nocheck
const { mergeConfig } = require('vite');
require('dotenv').config(); // 🔁 Load .env variables

const configDefault = require('../../config/env/default');

module.exports = (config) => {
  const allowedHosts = configDefault.vite.serverAllowedHosts || [];
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
