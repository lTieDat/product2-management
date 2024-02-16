const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../../controller/client/user.controller')
const userValidate = require('../../validate/client/user.validate')
const authMiddleware = require('../../middlewares/client/auth.middleware')


router.get('/register', controller.register)
router.post('/register', userValidate.registerPost, controller.registerPost)
router.get('/login', controller.login)
router.post('/login', userValidate.loginPost, controller.loginPost)
router.get('/logout', controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot",userValidate.forgotPasswordPost, controller.forgotPasswordPost);
router.get("/password/otp", controller.otp);
router.post("/password/otp",userValidate.otpPost, controller.otpPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", userValidate.resetPasswordPost, controller.resetPasswordPost);
router.get("/profile",authMiddleware.requireAuth, controller.profile);

module.exports = router;