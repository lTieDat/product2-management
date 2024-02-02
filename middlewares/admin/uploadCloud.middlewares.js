//upload file tĩnh lên cloud

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
//cloudinary config
cloudinary.config({
    cloud_name: "dodip3vc2",
    api_key: '392878392356125',
    api_secret: 'WGypkZIHC84dCSWXgcWDWa-KA60'
    
});
module.exports.upload = (req, res, next)=> {
    if(req.file){
      let streamUpload = (req) => {
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
  
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          req.body[req.file.fieldname] = result.secure_url;
          next();
      }
      upload(req);
    }
    else{
      next();
    }       
  }