'use strict';

/**
 * Enhanced upload plugin extension
 * 
 * This extension uses lifecycle hooks to intercept the upload response and add a custom field to it.
 * It also creates a short URL for each uploaded file using the Short.io service.
 */

// Import the createShortLink function from the shortio_script.js file
const { createShortLink } = require('../../../scripts/shortio_script');

module.exports = (plugin) => {
  console.log('🔌 Initializing custom upload plugin extension');
  
  // Register a lifecycle hook for the file model
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    
    // This hook runs after a file is created
    async afterCreate(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterCreate');
      
      // Add hello:world to the response
      if (result && typeof result === 'object') {
        result.hello = 'world';
        console.log('✅ Added hello:world to file:', result.id);
        
        // Create a short URL for the file
        if (result.url) {
          console.log('📁 Detected new file upload:', result.url);
          try {
            const shortLinkData = await createShortLink(result.url);
            if (shortLinkData && shortLinkData.shortURL) {
              result.shortUrl = shortLinkData.shortURL;
              console.log('✅ Short link created:', shortLinkData.shortURL);
            }
          } catch (error) {
            console.error('❌ Error creating short link:', error);
          }
        }
      }
    },
    
    // This hook runs after files are found
    afterFindMany(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterFindMany');
      
      // Add hello:world to each file in the response
      if (Array.isArray(result)) {
        result.forEach(file => {
          if (file && typeof file === 'object') {
            file.hello = 'world';
          }
        });
        console.log('✅ Added hello:world to', result.length, 'files');
      }
    },
    
    // This hook runs after a file is found
    afterFindOne(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterFindOne');
      
      // Add hello:world to the response
      if (result && typeof result === 'object') {
        result.hello = 'world';
        console.log('✅ Added hello:world to file:', result.id);
      }
    },
    
    // This hook runs after a file is updated
    afterUpdate(event) {
      const { result } = event;
      console.log('🔄 Lifecycle hook: afterUpdate');
      
      // Add hello:world to the response
      if (result && typeof result === 'object') {
        result.hello = 'world';
        console.log('✅ Added hello:world to file:', result.id);
      }
    }
  });
  
  // Return the unmodified plugin
  return plugin;
};
