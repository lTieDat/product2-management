const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();
const controller = require('../../controller/admin/my-account.controller.js');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares.js');
router.get('/', controller.myAccount);
router.get('/edit', controller.editMyAccount);
router.patch('/edit', upload.single('avatar'),
                      uploadCloud.upload,
                      controller.postEditMyAccount);
module.exports = router;