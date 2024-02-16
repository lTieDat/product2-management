const Cart = require('../../models/cart.models.js');

module.exports.cardId = async (req, res, next) => { 
    if(!req.cookies.cardId){
            const cart = new Cart();
            await cart.save();
            res.cookie('cardId',cart.id, {expires: new Date(Date.now() + 900000)});
    }else{
        const checkID = await Cart.find({
            _id: req.cookies.cardId
        });
        if(!checkID){
            const cart = new Cart();
            await cart.save();
            res.cookie('cardId',cart.id, {expires: new Date(Date.now() + 9000000)});
        }
        const cart = await Cart.findById({
            _id: req.cookies.cardId
        });
        if(cart){
            cart.totalQuantity = cart.products.reduce((total, product) => total + parseInt(product.quantity), 0);
            res.locals.miniCart = cart;
        }
    }    
    next();
}