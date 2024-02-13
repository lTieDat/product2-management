const Cart = require('../../models/cart.models.js');
const Product = require('../../models/product.model.js');
const priceHelper = require('../../helpers/priceNew_products.js');
const Order  = require('../../models/order.model.js');

// [GET] /checkout
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
    res.render("client/pages/checkout/index.pug", {
        pageTitle:" Đặt hàng",
        cart: cart
    })
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cardId = req.cookies.cardId;
    const userInfo = req.body;
    const cart = await Cart.findOne({
        _id: cardId
    });
    const products =[];
    for (const item of cart.products){
        const objectProduct = {
            product_id: item.product_id,
            quantity: item.quantity,
            price: 0,
            discount: 0
        };
        
        const productInfo = await Product.findOne({
            _id: item.product_id
        }).select("price discountPercentage");
        objectProduct.price = productInfo.price;
        objectProduct.discount = productInfo.discountPercentage;
        products.push(objectProduct);
    }
    const newOrder = {
        cart_id: cardId,
        UserInfo: userInfo,
        products: products,
    };
    const order = new Order(newOrder);
    order.save();
    //reset cart
    await Cart.updateOne({
        _id: cardId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order._id}`);
};

// [GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
        orderId: req.params.id
    })
}