const mongoose = require("mongoose");
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    brand: String,
    category: String,
    images:String,
    slug:{
        type:String,
        slug:"title",
        unique: true
    },
    thumbnail:String,
    deleted: {
        type: Boolean,
        default: false      
    },
    status: String,
    discountPercentage: Number,
    featured: String,
    stock: Number,
    deletedBy: {
        deletedAt: Date,
        account_id:String
    },
    createdBy:{
        createdAt: {
            type: Date, 
            default: Date.now
        },
        account_id:String
    },
    updatedBy: [
        {
            updatedAt: Date, 
            account_id:String
        }
    ],
    position: Number
},{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;