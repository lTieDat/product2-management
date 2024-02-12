

const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/client/cart.controller.js')
router.post('/add/:productId', controller.addCart)

module.exports = router;
