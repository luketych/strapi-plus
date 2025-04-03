const config = require('./index');

module.exports = () => {
  const awsConfig = {
    s3Options: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
      region: config.aws.region,
    },
    params: {
      ACL: null, // or 'public-read' if needed
      signedUrlExpires: config.aws.signedUrlExpires,
      Bucket: config.aws.bucket,
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
    // 'strapi-plugin-shortio': {
    //   enabled: true,
    // },
  };
};
