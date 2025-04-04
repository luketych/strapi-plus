module.exports = {
  server: {
    host: '0.0.0.0',
    port: 1337,
  },

  security: {
    appKeys: ['key1', 'key2', 'key3', 'key4'],
    apiTokenSalt: 'd2e122e7c03d69ac491e',
    adminJwtSecret: 'your-admin-secret-token',
    transferTokenSalt: '9af432e0a9359c6b3214',
    jwtSecret: 'your-secret-token',
  },

  database: {
    client: 'postgres',
    filename: '.tmp/data.db',
    host: 'strapiDB',
    port: 5432,
    name: 'strapi',
    username: 'strapi',
    password: 'strapi',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
    signedUrlExpires: Number(process.env.AWS_SIGNED_URL_EXPIRES || 900), // 15 minutes
  },

  services: {
    kutt: {
      url: 'https://ktrx.cards',
      apiKey: 'qAFKGfvvT3juLKV0jbuUP5CumHlQpm_IYtpATcXo',
    }
  },

  vite: {
    serverAllowedHosts: ['strapi.ktrx.cards', 'localhost'],
  }
};
