
const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/client/checkout.controller')
router.get('/', controller.index)
router.post("/order", controller.order)
router.get("/success/:orderId", controller.success)
module.exports = router;
