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
