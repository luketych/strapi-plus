const defaultConfig = require('./env/default');
const developmentConfig = require('./env/development');

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return target;
}

// Get environment-specific config based on NODE_ENV
function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  
  try {
    // Only development config exists for now
    if (env === 'development') {
      return developmentConfig;
    }
    return {};
  } catch (error) {
    console.warn(`No configuration found for environment: ${env}`);
    return {};
  }
}

// Merge configurations
const environmentConfig = getEnvironmentConfig();
const config = deepMerge({...defaultConfig}, environmentConfig);

module.exports = config;
