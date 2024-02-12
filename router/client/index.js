const homeRouter = require('./home.router.js');
const productRouter = require('./product.router.js');
const searchRouter = require('./search.route.js');
const cartRouter = require('./cart.route.js');  
const categoryMiddleware = require('../../middlewares/client/category.middleware.js');
const cartMiddleware = require('../../middlewares/client/cart.middelware.js');
const router = (app) =>{
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cardId);
    app.use('/',homeRouter);
    app.use('/products',productRouter);
    app.use('/search',searchRouter);
    app.use('/cart',cartRouter);
}

module.exports = router;