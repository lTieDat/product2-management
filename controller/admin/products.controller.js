const Product = require("../../models/product.model");
// [GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
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
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        { status: status }
    );
    req.flash('success', 'Đã thay đổi trạng thái sản phẩm');
    res.redirect("back");
};

// PATCH /admin/products/change-multi/
module.exports.changeMulti = async (req, res) => {
    // tai npm intall body-parser de convert data cua res.body
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
            break;
        case "deactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "deactive" }
            );
            req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: true
                    , deletedAt: new Date()
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
};

//DELETE /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // xoa vinh vien trong DB + them router vao be
    // await Product.deleteOne(
    //     {_id: id}
    // );
    // xoa mem bang cach thay attribute deleted : true
    await Product.updateOne(
        { _id: id }, {
        deleted: true,
        deletedAt: new Date()
    },
    );
    req.flash('success', `Đã xóa sản phẩm`);
    res.redirect("back");
};

// GET /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "them san pham",
    });
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
    // if(req.file)
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    console.log(req.body.discount);
    const newProduct = new Product(req.body);
    newProduct.discountPercentage = req.body.discount;
    newProduct.deleted = false;
    await newProduct.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

//GET /admin/products/edit/:id
module.exports.editById = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find);
        res.render(`admin/pages/products/edit.pug`, {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
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
    if (req.file)
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    try {
        await Product.updateOne(
            { _id: req.params.id }, req.body
        );
        req.flash('success', 'Đã cập nhật sản phẩm');
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
        res.render(`admin/pages/products/detail.pug`, {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (e) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};