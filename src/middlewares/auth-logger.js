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
    if (ctx.path.includes('/upload')) {
        strapi.log.info('🚀 Request started', {
          path: ctx.path,
          method: ctx.method
        });

        try {

            // Log authentication information
            const token = ctx.request.header.authorization;
            const tokenValue = token.replace('Bearer ', '').trim();

            const isPublicRoute = ctx.path.startsWith('/api/auth/') || 
                ctx.path === '/api/users-permissions/auth/local' ||
                ctx.method === 'GET';

            let decoded;
            // decoded = await strapi.plugins['users-permissions'].services.jwt.verify(tokenValue);

            // const auth = ctx.state.auth;



            // const strapiServices = strapi.plugins['users-permissions'].services

            // const jwtToken = await strapiServices.jwt.verify(tokenValue)

            // console.log('jwtToken', jwtToken)

            // strapi.log.info('🔑 Token validated', {
            //   userId: decoded.id,
            //   issueDate: new Date(decoded.iat * 1000).toISOString(),
            //   expiryDate: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'No expiry'
            // });
    



            // // Check user permissions
            // const user = await strapi.query('plugin::users-permissions.user').findOne({
            //   where: { id: decoded.id },
            //   populate: ['role']
            // });

            // if (!user) {
            //   strapi.log.error('❌ User not found for token', { userId: decoded.id });
            //   ctx.throw(401, 'User not found');
            // }

            // // Log user role and permissions
            // strapi.log.info('👤 User permissions', {
            //   role: user.role.name,
            //   uploadPermission: user.role.type === 'authenticated' || user.role.name === 'Admin'
            // });

            // // Check if user has upload permission
            // if (!(user.role.type === 'authenticated' || user.role.name === 'Admin')) {
            //   strapi.log.error('❌ User lacks upload permission', {
            //     userId: user.id,
            //     role: user.role.name
            //   });
            //   ctx.throw(403, 'You do not have permission to upload files');
            // }


        } catch (error) {
          strapi.log.error('🚫 Token validation failed', {
            error: error.message
          });
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