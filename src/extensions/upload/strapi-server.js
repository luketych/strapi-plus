'use strict';

/**
 * Enhanced upload plugin extension
 * 
 * This extension uses lifecycle hooks to intercept the upload response and add a custom field to it.
 * It also creates a short URL for each uploaded file using the Short.io service.
 */


const config = require('../../../config');

const awsConfig = config.aws


// Import the createShortLink function from the shortio_script.js file
const { createShortLink } = require('./createShortLink.js');

module.exports = (plugin) => {

  strapi.log.info('🔌 Initializing custom upload plugin extension');

  strapi.log.info('📦 AWS S3 Upload Plugin Configuration:');
  strapi.log.info(JSON.stringify({ ...awsConfig, s3Options: { ...awsConfig.s3Options, secretAccessKey: '***' } }, null, 2));

  // Register a lifecycle hook for the file model
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    
    // This hook runs after a file is created
    async afterCreate(event) {
      const { result } = event;
      strapi.log.info('🔄 Lifecycle hook: afterCreate');
      

      if (result && typeof result === 'object') {        
        // Create a short URL for the file
        if (result.url) {
          strapi.log.info('📁 Detected new file upload:', result.url);
          try {
            const shortLinkData = await createShortLink(result.url);
            if (shortLinkData && shortLinkData.shortURL) {
              result.shortUrl = shortLinkData.shortURL;
              strapi.log.info('✅ Short link created:', shortLinkData.shortURL);
            }
          } catch (error) {
            strapi.log.error('❌ Error creating short link:', error);
          }
        }
      }
    },
    
    // This hook runs after files are found
    afterFindMany(event) {
      const { result } = event;
      strapi.log.info('🔄 Lifecycle hook: afterFindMany');
    },
    
    // This hook runs after a file is found
    afterFindOne(event) {
      const { result } = event;
      strapi.log.info('🔄 Lifecycle hook: afterFindOne');
    },
    
    // This hook runs after a file is updated
    afterUpdate(event) {
      const { result } = event;
      strapi.log.info('🔄 Lifecycle hook: afterUpdate');
    }
  });
  
  return plugin;
};
