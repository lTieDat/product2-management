const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const validate = require('../../validate/admin/product-category.validate.js');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares.js');
const controller = require('../../controller/admin/product-category.controller');
router.get('/', controller.index);
router.get('/create',controller.create);
router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.patch('/change-status/:status/:id',controller.changeStatus);
router.patch('/change-multi',controller.changeMulti);
router.delete('/delete/:id',controller.deleteItem);
router.get('/edit/:id',controller.edit);
router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPath
);

module.exports = router;