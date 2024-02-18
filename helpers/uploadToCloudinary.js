const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
//cloudinary config
cloudinary.config({
    cloud_name: "dodip3vc2",
    api_key: '392878392356125',
    api_secret: 'WGypkZIHC84dCSWXgcWDWa-KA60'
    
});
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.secure_url;
}
