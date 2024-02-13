const Cart = require('../../models/cart.models.js');
const Product = require('../../models/product.model.js');
const priceHelper = require('../../helpers/priceNew_products.js');
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

// [GET] /cart
module.exports.index = async (req, res) => {
    const cardId = req.cookies.cardId;
    const cart = await Cart.findOne({
        _id: cardId
    });
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
            }).select("title thumbnail price slug discountPercentage");
            const newInfo = priceHelper.priceNew_product(productInfo);
            item.productInfo = productInfo;
            item.productInfo.newPrice = newInfo.newPrice;
            item.productInfo.discount = newInfo.discount;
       }
    }
    const totalPrice = cart.products.reduce((total, item) => {
        return total + item.productInfo.newPrice * item.quantity;
    }, 0);
    cart.totalPrice = totalPrice;
    res.render('client/pages/cart/index', {
        title: 'Giỏ hàng',
        cart: cart,
    })
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req,res) =>{
    const cartId = req.cookies.cardId;
    const productId = req.params.productId;
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            $pull: { products : { product_id : productId}}
        }
    );
    req.flash('success', 'Đã xóa sản phẩm khỏi giỏ hàng');
    res.redirect("back");
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req,res) =>{
    const cartId = req.cookies.cardId;
    const quantity = req.params.quantity;
    const productId = req.params.productId;
    await Cart.updateOne(
        {
            _id: cartId, "products.product_id": productId
        },
        {
            $set: { "products.$.quantity" : quantity}
        }
    );
    req.flash('success', 'Đã cập nhật giỏ hàng');
    res.redirect("back");
}