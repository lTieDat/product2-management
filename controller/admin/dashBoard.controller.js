const CategoryProduct = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");


// [GET] /admin/dashBoard
module.exports.dashBoard = async (req, res) => {
    const statistic = {
        categoryProduct:{
            total:0,
            active:0,
            deactive:0
        },
        product:{
            total:0,
            active:0,
            deactive:0
        },
        user:{
            total:0,
            active:0,
            deactive:0
        },
        account:{
            total:0,
            active:0,
            deactive:0
        }
    };
    // CategoryProduct
    statistic.categoryProduct.total = await CategoryProduct.countDocuments({
        deleted: false
    });
    statistic.categoryProduct.active = await CategoryProduct.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.categoryProduct.deactive = await CategoryProduct.countDocuments({
        deleted: false,
        status: "deactive"
    });

    // Product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });
    statistic.product.active = await Product.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.product.deactive = await Product.countDocuments({
        deleted: false,
        status: "deactive"
    });
    // User
    statistic.user.total = await User.countDocuments({
        deleted: false
    });
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.user.deactive = await User.countDocuments({
        deleted: false,
        status: "deactive"
    });

    // Account
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });
    statistic.account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.account.deactive = await Account.countDocuments({
        deleted: false,
        status: "deactive"
    });
    
    res.render("admin/pages/dashBoard/index.pug",{
        pageTitle: "DashBoard",
        statistic: statistic
    })
}

