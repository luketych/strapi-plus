'use strict';

module.exports = {
  upload(file) {
    // handle uploading the file
  },

  delete(file) {
    // handle deleting the file
  },

  // optional functions
  async uploadStream(file) {
    // handle streaming upload
  },

  async getSignedUrl(file) {
    // for generating signed URLs if needed
  },
};