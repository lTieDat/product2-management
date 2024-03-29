const productRouter = require('express');
const router = productRouter.Router();
const productController = require('../../controller/client/products.controller.js')
router.get('/', productController.products)
router.get('/detail/:slugProduct', productController.productDetail)
router.get('/:slugCategory', productController.productCategory)
module.exports = router;