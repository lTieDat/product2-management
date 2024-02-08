const dashBoardRouter = require('./dashBoard.router.js');
const productRouter = require('./products.router.js');
const systemConfig = require('../../config/system.js');
const productCategoryRouter = require('./product-category.router.js');
const roleRouter = require('./role.router.js');
const accountsRouter = require('./accounts.router.js');
const authRouter = require('./auth.route.js');
const authMiddleware = require('../../middlewares/admin/auth.middleware.js');
module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN+'/dashBoard'
            ,authMiddleware.requireAuth
            ,dashBoardRouter);
    app.use(PATH_ADMIN+'/products',authMiddleware.requireAuth,productRouter );
    app.use(PATH_ADMIN+'/products-category',authMiddleware.requireAuth,productCategoryRouter);
    app.use(PATH_ADMIN+'/roles',authMiddleware.requireAuth,roleRouter);
    app.use(PATH_ADMIN+'/accounts',authMiddleware.requireAuth,accountsRouter);
    app.use(PATH_ADMIN+'/auth',authRouter);
}
