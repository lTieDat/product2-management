const dashBoardRouter = require('./dashBoard.router.js');
const productRouter = require('./products.router.js');
const systemConfig = require('../../config/system.js');
module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN+'/dashBoard',dashBoardRouter);
    app.use(PATH_ADMIN+'/products',productRouter );
}
