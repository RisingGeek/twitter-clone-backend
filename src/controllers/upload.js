const cloudinary = require("cloudinary").v2;

module.exports = (file, resource_type) => {
  return new Promise((resolve, reject) => {
    if (!file) resolve({ secure_url: null });
    if (!resource_type) resolve({ secure_url: null });
    cloudinary.uploader
      .upload_stream({ resource_type }, (err, result) => {
        console.log(err, result);
        if (err) reject(err);
        resolve(result);
      })
      .end(file.buffer);
  });
};
