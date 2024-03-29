const Product = require("../../models/product.model");
// [GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
module.exports.product = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    // tim kiem san pham su dung module search.js
    const objectSearch = objectSearchHelper(req.query);
    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    //end tim kiem san pham su dung module search.js
    //object sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    //end object sort

    //pagination
    const countProduct = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 4,
    }, req.query, countProduct);
    //end pagination

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        // lấy thông tin người tạo và thời gian
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if(user){
            product.accountFullName = user.fullName;
        }

        // lấy thông tin người cập nhật và thời gian
        const updatedBy = product.updatedBy[product.updatedBy.length-1];
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdated.fullName;
        }
    }  
    res.render("admin/pages/products/index.pug", {
        pageTitle: "danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//PATCH/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("product_edit")){    
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };

        await Product.updateOne(
            { _id: id },
            { status: status, $push :{updatedBy: updatedBy}
        });
        req.flash('success', 'Đã thay đổi trạng thái sản phẩm');
        res.redirect("back");
    }
    else{
        req.flash('error', 'Bạn không có quyền chỉnh sửa sản phẩm');
        res.redirect("back");
    }
};

// PATCH /admin/products/change-multi/
module.exports.changeMulti = async (req, res) => {
    // tai npm intall body-parser de convert data cua res.body
    const permissions = res.locals.role.permissions;
    if (permissions.includes("product_edit")) {
        const type = req.body.type;
        const ids = req.body.ids.split(",");
        const updatedBy ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        switch (type) {
            case "active":
                await Product.updateMany(
                    { _id: { $in: ids } },
                    { status: "active" , $push :{updatedBy: updatedBy}}
                );
                req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
                break;
            case "deactive":
                await Product.updateMany(
                    { _id: { $in: ids } },
                    { status: "deactive" , $push :{updatedBy: updatedBy}}
                );
                req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
                break;
            case "delete-all":
                await Product.updateMany(
                    { _id: { $in: ids } },
                    {
                        deleted: true
                        , deletedBy:{
                            account_id: res.locals.user.id,
                            deletedAt: new Date()
                        }, $push :{updatedBy: updatedBy}
                    }          
                );
                req.flash('success', `Đã xóa ${ids.length} sản phẩm`);
                break;
            case "change-position":
                for (item of ids) {
                    let [id, position] = item.split("-");
                    await Product.updateOne(
                        { _id: id },
                        { position: position }
                    );
                }
                req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
                break;
            default:
                break;
        }
        res.redirect("back");
    }
    else {
        req.flash('error', 'Bạn không có quyền chỉnh sửa sản phẩm');
        res.redirect("back")
    }
}

//DELETE /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("product_delete")) {
        const id = req.params.id;
        // xoa vinh vien trong DB + them router vao be
        // await Product.deleteOne(
        //     {_id: id}
        // );
        // xoa mem bang cach thay attribute deleted : true
        await Product.updateOne(
            { _id: id }, {
            deleted: true,
            deletedBy:{
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        },
        );
        req.flash('success', `Đã xóa sản phẩm`);
        res.redirect("back");
    }
    else {
        req.flash('error', 'Bạn không có quyền xóa sản phẩm');
        res.redirect("back");
    }
};

// GET /admin/products/create
module.exports.create = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("product_create")) {
        let find ={
            deleted: false
        };
        const records= await ProductCategory.find(find);
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/products/create.pug", {
            pageTitle: "Thêm sản phẩm mới",
            records: newRecords
        });
    }
    else {
        req.flash('error', 'Bạn không có quyền tạo sản phẩm');
        res.redirect("back");
    }
};

// POST /admin/products/createPost
module.exports.createPost = async (req, res) => {
    //validate data title
    //handle NaN 
    if (!req.body.position) {
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    if (isNaN(req.body.price)) {
        req.body.price = 0;
    }
    else {
        req.body.price = parseInt(req.body.price);
    }
    if (isNaN(req.body.stock)) {
        req.body.stock = 0;
    }
    else {
        req.body.stock = parseInt(req.body.stock);
    }
    if (isNaN(req.body.discount)) {
        req.body.discount = 0;
    }
    else {
        req.body.discount = parseInt(req.body.discount);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    };

    const newProduct = new Product(req.body);
    newProduct.discountPercentage = req.body.discount;
    newProduct.deleted = false;
    await newProduct.save();
    req.flash('success', 'Đã thêm sản phẩm mới');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//GET /admin/products/edit/:id
module.exports.editById = async (req, res) => {
    try {
        const permissions = res.locals.role.permissions;
        if (permissions.includes("product_edit")) {
            const find = {
                _id: req.params.id,
                deleted: false
            }
            const records= await ProductCategory.find({
                deleted: false
            });
            const newRecords = createTreeHelper.tree(records);
            const product = await Product.findOne(find);
            res.render(`admin/pages/products/edit.pug`, {
                pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
                records: newRecords
            });
        }
        else {
            req.flash('error', 'Bạn không có quyền chỉnh sửa sản phẩm');
            res.redirect("back");
        }
    } catch (e) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};

//PATCH /admin/products/edit/:id
module.exports.editPath = async (req, res) => {
    if (!req.body.position) {
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    if (isNaN(req.body.price)) {
        req.body.price = 0;
    }
    else {
        req.body.price = parseInt(req.body.price);
    }
    if (isNaN(req.body.stock)) {
        req.body.stock = 0;
    }
    else {
        req.body.stock = parseInt(req.body.stock);
    }
    if (isNaN(req.body.discount)) {
        req.body.discount = 0;
    }
    else {
        req.body.discount = parseInt(req.body.discount);
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };

        await Product.updateOne(
            { _id: req.params.id }, 
            {...req.body, $push :{updatedBy: updatedBy}}
        );
        req.flash('success', 'Đã cập nhật sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
    }
    res.redirect(`back`);
};

//GET /admin/products/detail/:id
module.exports.productDetail = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find);
        const productCategory = await ProductCategory.findOne({
            _id: product.category
        });
        res.render(`admin/pages/products/detail.pug`, {
            pageTitle: "Chi tiết sản phẩm",
            product: product,
            productCategory: productCategory
        });
    } catch (e) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};