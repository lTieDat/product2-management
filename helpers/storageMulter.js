const multer = require('multer');
module.exports = () => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, './public/uploads/');
        },
        filename: function(req, file, cb) {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      });
      
      var upload = multer({ storage: storage });
      return storage;
};