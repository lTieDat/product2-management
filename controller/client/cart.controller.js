const Cart = require('../../models/cart.models.js');

//[POST] /cart/add/:productId
module.exports.addCart = async (req, res) => {
    const productId = req.params.productId;
    const quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
    const cartId = req.cookies.cardId;
    const existCart = await Cart.findOne({_id: cartId});
    const existProduct = existCart.products.find(product => product.product_id == productId);
    if(existProduct){
        const newQuantity = parseInt(existProduct.quantity) + parseInt(quantity);
        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId
            },
            {
                $set: { "products.$.quantity" : newQuantity}
            }
        );
        req.flash('success', 'Đã cập nhật giỏ hàng');
        res.redirect("back");
    }else{  
        const cartObject = {
            product_id : productId,
            quantity: quantity,
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products : cartObject}
            }
        );
        req.flash('success', 'Đã thêm sản phẩm vào giỏ hàng');
        res.redirect("back");
    }
};