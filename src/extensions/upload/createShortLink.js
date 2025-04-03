'use strict';

const axios = require('axios');
const config = require('../../../config');

const KUTT_URL = config.services.kutt.url;
const KUTT_X_API_KEY = config.services.kutt.apiKey;

console.log('📦 Using link shortening service:', KUTT_URL);

async function createShortLink(originalURL) {
  try {
    const response = await axios.post(
      `${KUTT_URL}/api/v2/links`,
      {
        target: originalURL,
      },
      {
        headers: {
          'X-API-KEY': KUTT_X_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Short link created:', originalURL, response.data.shortURL);
    return response.data;
  } catch (err) {
    console.error('❌ Error creating short link:', err.response?.data || err.message);
    return null;
  }
}

// Function to check if a file is being run directly
function isMainModule() {
  return require.main === module;
}

// Optional: CLI usage
if (isMainModule()) {
  const longUrl = process.argv[2];
  if (!longUrl) {
    console.error('⚠️  Usage: node shortio_script.js <long-url>');
    process.exit(1);
  }
  createShortLink(longUrl);
}

module.exports = {
  createShortLink
};
