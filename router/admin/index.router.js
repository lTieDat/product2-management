const dashBoardRouter = require('./dashBoard.router.js');
const productRouter = require('./products.router.js');
const systemConfig = require('../../config/system.js');
const productCategoryRouter = require('./product-category.router.js');
const roleRouter = require('./role.router.js');
module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN+'/dashBoard',dashBoardRouter);
    app.use(PATH_ADMIN+'/products',productRouter );
    app.use(PATH_ADMIN+'/products-category',productCategoryRouter);
    app.use(PATH_ADMIN+'/roles',roleRouter);
}
