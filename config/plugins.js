// ~/strapi-aws-s3/backend/config/plugins.js
module.exports = ({ env }) => {
  const awsConfig = {
    s3Options: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
      region: env('AWS_REGION'),
    },
    params: {
      ACL: null, // or 'public-read' if needed
      signedUrlExpires: env.int('AWS_SIGNED_URL_EXPIRES', 15 * 60),
      Bucket: env('AWS_BUCKET'),
    },
  };

  console.log('\n📦 AWS S3 Upload Plugin Configuration:');
  console.log(JSON.stringify({ ...awsConfig, s3Options: { ...awsConfig.s3Options, secretAccessKey: '***' } }, null, 2));

  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: awsConfig,
        actionOptions: {
          upload: {
            ACL: null,
          },
          uploadStream: {
            ACL: null,
          },
          delete: {},
        },
      },
    },

    // ✅ Register your plugin here
    'strapi-plugin-shortio': {
      enabled: true,
    },
  };
};
