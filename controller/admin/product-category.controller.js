const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");
const treeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");  
// GET /admin/product-category
module.exports.index = async(req,res)=>{
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = objectSearchHelper(req.query);
    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    //object sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }

    //pagination
    const countProductCategory = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 10,
    }, req.query, countProductCategory);
    //end pagination

    const records= await ProductCategory.find(find).sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
    for(const record of records){
        const user = await Account.findOne({
            _id:  record.createdBy.account_id
        });
        if(user){
            record.accountFullName = user.fullName;
        }
    }
    const newRecords = treeHelper.tree(records);
     res.render("admin/pages/product-category/index",{
        pageTitle: "Product Category",
        records: newRecords,
        keyword: objectSearch.keyword,
        filterStatus: filterStatus,
        pagination: objectPagination
    })
};

// GET /admin/product-category/create
module.exports.create = async(req,res)=>{
    const permissions = res.locals.role.permissions
    if(permissions.includes("product-category_create")){
        let find ={
            deleted: false
        };
        const records= await ProductCategory.find(find);
        const newRecords = treeHelper.tree(records);
        res.render("admin/pages/product-category/create",{
            pageTitle: "Create Product Category",
            records: newRecords
        })
    }
    else{
        req.flash('error', 'Bạn không có quyền tạo danh mục sản phẩm');
        res.redirect("back")
    }
}

// POST /admin/product-category/createPost
module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
            const countProductCategory = await ProductCategory.countDocuments();
            req.body.position = countProductCategory + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };
    const record = new ProductCategory(req.body);
    await record.save();
    return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

//PATCH/admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("product-category_edit")){
        const status = req.params.status;
        const id = req.params.id;
        await ProductCategory.updateOne(
            { _id: id },
            { status: status }
        );
        req.flash('success', 'Đã thay đổi trạng thái sản phẩm');
        res.redirect("back");
    }else{
        // popup error
        req.flash('error', 'Bạn không có quyền chỉnh sửa danh mục sản phẩm');
        res.redirect("back")
    }
};

//DELETE /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("product-category_delete")){
        const id = req.params.id;
        await ProductCategory.updateOne(
            { _id: id }, {
            deleted: true,
            deletedAt: new Date()
        },
        );
        req.flash('success', `Đã xóa sản phẩm`);
        res.redirect("back");
    }
}

//GET /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const permissions = res.locals.role.permissions;
        if(permissions.includes("product-category_edit")){
            const find = {
                _id: req.params.id,
                deleted: false
            }
            const data = await ProductCategory.findOne(find);
            const records= await ProductCategory.find({
                deleted: false
            });
            const newRecords = treeHelper.tree(records);
            res.render("admin/pages/product-category/edit", {
                pageTitle: "Chỉnh sửa danh mục sản phẩm",
                data: data,
                records: newRecords
            });
        }
        else{
            req.flash('error', 'Bạn không có quyền chỉnh sửa danh mục sản phẩm');
            res.redirect("back")
        }
    } catch (e) {
        req.flash('error', 'Không tìm thấy danh mục sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};
//PATCH /admin/products-category/edit/:id
module.exports.editPath = async (req, res) => {
    if (!req.body.position) {
        const countProduct = await ProductCategory.countDocuments();
        req.body.position = countProduct + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        await ProductCategory.updateOne(
            { _id: req.params.id }, 
            {
                ... req.body, $push: { updatedBy: updatedBy }
            }
        );
        req.flash('success', 'Đã cập nhật danh mục sản phẩm thành công');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect("back")
    }
};

//PATCH /admin/products-category/change_multi/
module.exports.changeMulti = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("product-category_edit")){
        const type = req.body.type;
        const ids = req.body.ids.split(",");
        switch (type) {
            case "active":
                await ProductCategory.updateMany(
                    { _id: { $in: ids } },
                    { status: "active" }
                );
                req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
                break;
            case "deactive":
                await ProductCategory.updateMany(
                    { _id: { $in: ids } },
                    { status: "deactive" }
                );
                req.flash('success', `Đã thay đổi trạng thái ${ids.length} sản phẩm`);
                break;
            case "delete-all":
                await ProductCategory.updateMany(
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
                    await ProductCategory.updateOne(
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
    else{
        req.flash('error', 'Bạn không có quyền chỉnh sửa danh mục sản phẩm');
        res.redirect("back")
    }
}
