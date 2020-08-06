const cloudinary = require("cloudinary").v2;

module.exports = (buffer, resource_type) => {
    console.log('here',buffer, resource_type)
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type }, (err, result) => {
        console.log(err, result);
        if (err) reject(err);
        resolve(result);
      })
      .end(buffer);
  });
};
