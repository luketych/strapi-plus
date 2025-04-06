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
    if (ctx.path.includes('/upload')) {
      strapi.log.info('🚀 Upload middleware - START', {
        path: ctx.path,
        method: ctx.method,
        filesCount: ctx.request.files ? Object.keys(ctx.request.files).length : 0
      });

      // Log authentication information
      const token = ctx.request.header.authorization;
      if (!token) {
        strapi.log.warn('⚠️ No authorization token provided for upload request');
        ctx.throw(401, 'Authorization header not found');
      }

      try {
        // Attempt to decode the token (assumes Bearer token)
        const tokenValue = token.replace('Bearer ', '');
        const decoded = strapi.plugins['users-permissions'].services.jwt.verify(tokenValue);
        
        strapi.log.info('🔑 Token validated', {
          userId: decoded.id,
          issueDate: new Date(decoded.iat * 1000).toISOString(),
          expiryDate: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'No expiry'
        });

        // Check user permissions
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { id: decoded.id },
          populate: ['role']
        });

        if (!user) {
          strapi.log.error('❌ User not found for token', { userId: decoded.id });
          ctx.throw(401, 'User not found');
        }

        // Log user role and permissions
        strapi.log.info('👤 User permissions', {
          role: user.role.name,
          uploadPermission: user.role.type === 'authenticated' || user.role.name === 'Admin'
        });

        // Check if user has upload permission
        if (!(user.role.type === 'authenticated' || user.role.name === 'Admin')) {
          strapi.log.error('❌ User lacks upload permission', {
            userId: user.id,
            role: user.role.name
          });
          ctx.throw(403, 'You do not have permission to upload files');
        }

      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          strapi.log.error('❌ Invalid token provided', { error: error.message });
          ctx.throw(401, 'Invalid token');
        } else if (error.name === 'TokenExpiredError') {
          strapi.log.error('❌ Token expired', {
            expiredAt: error.expiredAt.toISOString()
          });
          ctx.throw(401, 'Token expired');
        } else if (error.status === 401 || error.status === 403) {
          // Re-throw authorization errors
          throw error;
        } else {
          strapi.log.error('❌ Error processing upload request', {
            error: error.message,
            stack: error.stack
          });
          ctx.throw(500, 'Internal server error');
        }
      }
    }

    await next();

    // Log response status after the request is processed
    if (ctx.path.includes('/upload')) {
      strapi.log.info('🏁 Upload middleware - END', {
        status: ctx.status,
        responseTime: ctx.response.get('X-Response-Time')
      });
    }
  };
};
