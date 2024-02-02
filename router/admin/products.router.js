const homeRouter = require('express');
const multer = require('multer');
// lưu file ở local - không dùng khi deploy
// const storageMulter = require('../../helpers/storageMulter.js');
// const upload = multer(
//     { storage: storageMulter()}
// );
const controller = require('../../controller/admin/products.controller.js')
const validate = require('../../validate/admin/product.validate.js');
const router = homeRouter.Router();
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares.js');

router.get('/', controller.product);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    validate.createPost,
    controller.editPath
);
router.get('/edit/:id',controller.editById);
router.get('/detail/:id',controller.productDetail);
module.exports = router;