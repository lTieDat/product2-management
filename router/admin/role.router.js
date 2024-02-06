const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/admin/role.controller.js')
router.get('/', controller.index)
router.get('/create', controller.create);
router.post('/create', controller.postCreate);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.patchEdit);
router.get('/permissions', controller.permissions);
router.patch('/permissions', controller.patchPermissions);
module.exports = router;