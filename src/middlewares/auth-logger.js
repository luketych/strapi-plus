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
        // Extract token value
        const tokenValue = token.replace('Bearer ', '');
        
        try {
          // Debug log token details
          strapi.log.debug({ token: tokenValue }, 'Attempting token verification');

          // Attempt to decode the token
          const decoded = strapi.plugins['users-permissions'].services.jwt.verify(tokenValue);

          // Debug log decoded token timestamps
          strapi.log.debug({
            iat: typeof decoded.iat,
            value: decoded.iat,
            exp: typeof decoded.exp,
            expValue: decoded.exp
          }, 'Token timestamp values');

          // Validate timestamps before using them
          let issueDate = 'Invalid issue date';
          let expiryDate = 'No expiry';

          if (typeof decoded.iat === 'number' && !isNaN(decoded.iat)) {
            try {
              issueDate = new Date(decoded.iat * 1000).toISOString();
            } catch (dateError) {
              strapi.log.error('❌ Invalid issue date in token', {
                iat: decoded.iat,
                error: dateError.message
              });
            }
          }

          if (decoded.exp && typeof decoded.exp === 'number' && !isNaN(decoded.exp)) {
            try {
              expiryDate = new Date(decoded.exp * 1000).toISOString();
            } catch (dateError) {
              strapi.log.error('❌ Invalid expiry date in token', {
                exp: decoded.exp,
                error: dateError.message
              });
            }
          }

          strapi.log.info('🔑 Token validated', {
            userId: decoded.id,
            issueDate,
            expiryDate,
            tokenValue // Include token value in successful validation logs
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
          // Log detailed token validation errors
          if (error.name === 'JsonWebTokenError') {
            strapi.log.error('❌ Invalid token provided', { 
              error: error.message,
              errorType: error.name,
              path: ctx.path,
              token: tokenValue,
              stack: error.stack
            });

            // Attempt token recovery - currently just logs the attempt
            strapi.log.info('🔄 Attempting token recovery', {
              strategy: 'invalidate_and_require_reauth',
              path: ctx.path
            });
          } else if (error.name === 'TokenExpiredError') {
            strapi.log.error('❌ Token expired', {
              expiredAt: error.expiredAt.toISOString(),
              path: ctx.path,
              token: tokenValue
            });

            // Log expiry details for debugging
            strapi.log.debug('Token expiry details', {
              currentTime: new Date().toISOString(),
              tokenExpiry: error.expiredAt.toISOString(),
              timeDiff: Math.floor((Date.now() - error.expiredAt) / 1000) + ' seconds'
            });
          } else {
            strapi.log.error('❌ Error processing auth token', {
              error: error.message,
              errorType: error.name,
              stack: error.stack,
              path: ctx.path,
              token: tokenValue,
              timestamp: new Date().toISOString()
            });
          }

          // Return appropriate status for token errors
          ctx.status = error.name === 'TokenExpiredError' ? 401 : 403;
          ctx.body = {
            error: 'Token validation failed',
            message: error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token'
          };
        }
      }
    }

    try {
      await next();
    } catch (error) {
      // Log authentication and permission errors
      if (error.name === 'UnauthorizedError') {
        strapi.log.error('🚫 Unauthorized access attempt', {
          path: ctx.path,
          method: ctx.method,
          error: error.message
        });
      } else if (error.name === 'ForbiddenError') {
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
