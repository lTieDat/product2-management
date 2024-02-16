const homeRouter = require('./home.router.js');
const productRouter = require('./product.router.js');
const searchRouter = require('./search.route.js');
const cartRouter = require('./cart.route.js');  
const categoryMiddleware = require('../../middlewares/client/category.middleware.js');
const cartMiddleware = require('../../middlewares/client/cart.middelware.js');
const checkoutRouter = require('./checkout.route.js');
const userRouter = require('./user.route.js');
const userInfoMiddleware = require('../../middlewares/client/user.middleware.js');
const settingMiddleware = require('../../middlewares/client/setting.middleware.js');



const router = (app) =>{
    app.use(settingMiddleware.settingGeneral);
    app.use(userInfoMiddleware.infoUser);
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cardId);
    app.use('/',homeRouter);
    app.use('/products',productRouter);
    app.use('/search',searchRouter);
    app.use('/cart',cartRouter);
    app.use('/checkout',checkoutRouter);
    app.use('/user',userRouter);
}

module.exports = router;