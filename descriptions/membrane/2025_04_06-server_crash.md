
I get this error sometimes. Please add better logging for it and error recovery.


```@roo
Plan:

1.  **Enhance Logging in `src/middlewares/auth-logger.js`:**
    *   **Logging for Time Value Error:**
        *   Add `strapi.log.debug({iat: typeof decoded.iat, value: decoded.iat}, 'iat value')` before line 41.
        *   Add `strapi.log.debug({exp: typeof decoded.exp, value: decoded.exp}, 'exp value')` before line 42.
        *   Add a check `if (typeof decoded.iat !== 'number' || isNaN(decoded.iat))` before line 41. If it's not a number, log an error and use a default date or skip the logging.
        *   Add a check `if (decoded.exp && (typeof decoded.exp !== 'number' || isNaN(decoded.exp)))` before line 42. If it's not a number, log an error and use a default date or skip the logging.
    *   **Logging for Invalid Token Error:**
        *   In the `catch` block (lines 68-86), add `token: tokenValue` to the error log.
2.  **Consider Error Recovery (Implementation depends on specific requirements):**
    *   Token retry mechanism (if multiple secret keys are used).
    *   Token invalidation and re-authentication.
```


{
  error: 'Invalid time value',
  stack: 'RangeError: Invalid time valugit e\n' +
    '    at Date.toISOString (<anonymous>)\n' +
    '    at /Users/luketych/Dev/_projects/_cards/strapi-plus/src/middlewares/auth-logger.js:41:53\n' +
    '    at dispatch (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/koa-compose/index.js:42:32)\n' +
    '    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/core/dist/middlewares/logger.js:6:15\n' +
    '    at dispatch (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/koa-compose/index.js:42:32)\n' +
    '    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/core/dist/middlewares/powered-by.js:12:15\n' +
    '    at dispatch (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/koa-compose/index.js:42:32)\n' +
    '    at cors (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@koa/cors/index.js:106:22)\n' +
    '    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)',
  path: '/admin/project-type',
  level: '\x1B[31merror\x1B[39m',
  message: '❌ Error processing auth token',
  timestamp: '2025-04-06 15:01:10.437'
}
Waiting for the debugger to disconnect...
/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/plugin-users-permissions/dist/server/index.js:1639
                            return reject(new Error('Invalid token.'));
                                          ^

Error: Invalid token.
    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/plugin-users-permissions/dist/server/index.js:1639:43
    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/jsonwebtoken/verify.js:171:14
    at getSecret (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/jsonwebtoken/verify.js:97:14)
    at module.exports [as verify] (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/jsonwebtoken/verify.js:101:10)
    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/plugin-users-permissions/dist/server/index.js:1637:25
    at new Promise (<anonymous>)
    at Object.verify (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/plugin-users-permissions/dist/server/index.js:1636:24)
    at /Users/luketych/Dev/_projects/_cards/strapi-plus/src/middlewares/auth-logger.js:37:76
    at dispatch (/Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/koa-compose/index.js:42:32)
    at /Users/luketych/Dev/_projects/_cards/strapi-plus/node_modules/@strapi/core/dist/middlewares/logger.js:6:15
