const homeRouter = require('./home.router.js');
const productRouter = require('./product.router.js');

const router = (app) =>{
    app.use('/',homeRouter);
    app.use('/products',productRouter);
}

module.exports = router;