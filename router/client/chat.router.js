const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/client/chat.controller')
router.get('/', controller.index)

module.exports = router;