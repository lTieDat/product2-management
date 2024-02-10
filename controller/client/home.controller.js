const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");
const treeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");  


//[GET] /home
module.exports.index = async (req,res) =>{
    res.render('client/pages/home/index.pug',{
        title: 'Trang chu'
    });
}