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
            res.cookie('cardId',cart.id, {expires: new Date(Date.now() + 900000)});
        }
        
    }
    
    next();
}