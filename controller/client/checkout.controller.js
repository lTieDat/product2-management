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
        objectProduct.discountPercentage = productInfo.discountPercentage;
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
    const order = await Order.findOne({
        _id: req.params.orderId
    });
    for(const item of order.products){
        const productInfo = await Product.findOne({
            _id: item.product_id
        }).select("title thumbnail slug");
        item.productInfo = productInfo;
        const newInfo = priceHelper.priceNew_product(item);
        item.priceNew = newInfo.newPrice;
        item.discount = newInfo.discount;
        item.totalPrice = item.priceNew * item.quantity;
    }

    order.totalPrice = order.products.reduce((total, item) => {
        return total + item.totalPrice;
    }, 0);
    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}