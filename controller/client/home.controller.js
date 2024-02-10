const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");
const treeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");  
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/priceNew_products");
//[GET] /home
module.exports.index = async (req,res) =>{
    // lay ra san pham noi bat
    const featureProducts = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    });
    const newProducts = productHelper.priceNew_products(featureProducts);
    res.render('client/pages/home/index.pug',{
        title: 'Trang chu',
        featureProducts: newProducts
    });
}