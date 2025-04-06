'use strict';

/**
 * Auth logger middleware
 * 
 * This middleware logs authentication and permission information for all API requests.
 * It helps debug token and permission issues across the application.
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip logging for upload endpoints (handled by upload middleware)
    if (!ctx.path.includes('/upload')) {
      strapi.log.info('🚀 Request started', {
        path: ctx.path,
        method: ctx.method
      });

      // Log authentication information
      const token = ctx.request.header.authorization;
      if (!token) {
        // Only log a warning for endpoints that require authentication
        const isPublicRoute = ctx.path.startsWith('/api/auth/') || 
                            ctx.path === '/api/users-permissions/auth/local' ||
                            ctx.method === 'GET';
                            
        if (!isPublicRoute) {
          strapi.log.warn('⚠️ No authorization token provided', {
            path: ctx.path,
            method: ctx.method
          });
        }
      } else {
        try {
          // Attempt to decode the token
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
          } else {
            // Log user role
            strapi.log.info('👤 User permissions', {
              userId: user.id,
              role: user.role.name
            });

            // Log requested endpoint permission
            const endpoint = `${ctx.method} ${ctx.path}`;
            strapi.log.info('🎯 Endpoint access attempt', {
              endpoint,
              userId: user.id,
              role: user.role.name
            });
          }
        } catch (error) {
          if (error.name === 'JsonWebTokenError') {
            strapi.log.error('❌ Invalid token provided', { 
              error: error.message,
              path: ctx.path
            });
          } else if (error.name === 'TokenExpiredError') {
            strapi.log.error('❌ Token expired', {
              expiredAt: error.expiredAt.toISOString(),
              path: ctx.path
            });
          } else {
            strapi.log.error('❌ Error processing auth token', {
              error: error.message,
              stack: error.stack,
              path: ctx.path
            });
          }
        }
      }
    }

    try {
      await next();
    } catch (error) {
      // Log authentication and permission errors
      if (error.status === 401) {
        strapi.log.error('🚫 Unauthorized access attempt', {
          path: ctx.path,
          method: ctx.method,
          error: error.message
        });
      } else if (error.status === 403) {
        strapi.log.error('🚫 Forbidden access attempt', {
          path: ctx.path,
          method: ctx.method,
          error: error.message
        });
      }
      throw error; // Re-throw to maintain error handling chain
    }

    // Skip logging response for upload endpoints
    if (!ctx.path.includes('/upload')) {
      strapi.log.info('🏁 Request completed', {
        path: ctx.path,
        method: ctx.method,
        status: ctx.status,
        responseTime: ctx.response.get('X-Response-Time')
      });
    }
  };
};
