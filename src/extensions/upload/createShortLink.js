'use strict';

require('dotenv/config');
const axios = require('axios');

const KUTT_URL = process.env.KUTT_URL;
const KUTT_X_API_KEY = process.env.KUTT_X_API_KEY;

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
