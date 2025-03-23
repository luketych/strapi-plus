'use strict';

/**
 * Upload middleware
 * 
 * This middleware logs information about upload requests.
 * It works alongside the custom upload controller in strapi-server.js.
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only log for upload-related endpoints
    if (ctx.path.includes('/upload') && ctx.method === 'POST') {
      console.log('🚀 Upload middleware - START');
      console.log('📝 Request path:', ctx.path);
      console.log('📝 Request method:', ctx.method);
      console.log('📁 Request files count:', ctx.request.files ? Object.keys(ctx.request.files).length : 0);
    }

    await next();
  };
};
