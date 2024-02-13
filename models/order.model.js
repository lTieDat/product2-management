const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        cart_id: String,
        UserInfo:{
            fullName :String,
            phone : String,
            address: String,
        },
        products:[
            {
                product_id: String,
                quantity: Number,
                price: Number,
                discountPercentage: Number
            }
        ],
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt : Date    
    },
    {
    timestamps: true
});

const Order = mongoose.model('Orders',orderSchema, 'orders');

module.exports = Order;