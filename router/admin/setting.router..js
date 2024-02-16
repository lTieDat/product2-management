const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/admin/setting.controller')
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares');


router.get('/general', controller.index)
router.patch('/general', 
            upload.single("logo"), 
            uploadCloud.upload,
            controller.updateGeneral)

module.exports = router;