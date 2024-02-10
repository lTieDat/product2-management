const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");
const treeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model"); 

module.exports.category = async(res,req,next)=>{
    let find = {
        deleted: false,
    };
    const productCategory= await ProductCategory.find(find);
    const newProductCate = treeHelper.tree(productCategory);
    res.app.locals.productCategory = newProductCate;
    next();
}