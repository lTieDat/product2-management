const express = require('express');
const multer = require('multer');
const upload = multer();
const controller = require('../../controller/admin/accounts.controller.js')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares.js');
const validate = require('../../validate/admin/account.validate.js');
const router = express.Router();
router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', 
        upload.single('avatar'), 
        uploadCloud.upload, 
        validate.createPost,
        controller.postCreate
);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', 
        upload.single('avatar'), 
        uploadCloud.upload, 
        validate.editPath,
        controller.postEdit
);

module.exports = router;