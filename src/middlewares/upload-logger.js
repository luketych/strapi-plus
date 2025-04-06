'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.path.includes('/upload') && ['POST', 'DELETE'].includes(ctx.method)) {
      strapi.log.info(`📦 Upload request from IP: ${ctx.ip} | Method: ${ctx.method}`);
    }

    await next();
  };
};