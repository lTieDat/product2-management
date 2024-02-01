const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/admin/dashBoard.controller.js')
router.get('/', controller.dashBoard)

module.exports = router;