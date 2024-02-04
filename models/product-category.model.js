const mongoose = require("mongoose");
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,
    description: String,
    parentID: {
        type:String,
        default: ""
    },
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
    deletedAt: Date,
    position: Number
},{
    timestamps: true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'product-Category');

module.exports = ProductCategory;