const homeRouter = require('./home.router.js');
const productRouter = require('./product.router.js');
const categoryMiddleware = require('../../middlewares/client/category.middleware.js');
const router = (app) =>{
    app.use(categoryMiddleware.category);
    app.use('/',homeRouter);
    app.use('/products',productRouter);
}

module.exports = router;