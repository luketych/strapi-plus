// ~/strapi-aws-s3/backend/config/middlewares.js

module.exports = [
  'strapi::errors',
  /* Replace 'strapi::security', with this snippet */
  /* Beginning of snippet */
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'luketych-strapi-aws-s3-images-bucket.s3.us-east-2.amazonaws.com'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'luketych-strapi-aws-s3-images-bucket.s3.us-east-2.amazonaws.com'
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  /* End of snippet */
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  {
    name: 'global::auth-logger',
    resolve: './src/middlewares/auth-logger'
  },
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',



  {
    name: 'global::upload-logger',
    resolve: './src/middlewares/upload-logger.js',
  }
];
