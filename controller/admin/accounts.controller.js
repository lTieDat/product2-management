const systemConfig = require("../../config/system");
const Account = require("../../models/account.model.js");
const Role = require("../../models/roles.model.js");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index =async  (req, res) => {
    let find={
        deleted: false
    };
    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne(
            {deleted: false, _id: record.role_id}
        );
        record.role = role;
    }
    res.render('admin/pages/accounts/index',{
        pageTitle: "Danh sách tài khoản người dùng",
        records: records
    });
}

// [GET] /admin/accounts/create
module.exports.create = async(req, res) => {
    const records = await Role.find(
       { deleted : false}
    );

    res.render('admin/pages/accounts/create',{
        pageTitle: "Thêm tài khoản người dùng",
        records: records
    });
}

// [POST] /admin/accounts/createPost
module.exports.postCreate = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash('error', `Email ${emailExist} đã tồn tại`);
        res.redirect("back");
    }else{
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

//PATCH/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Account.updateOne(
        { _id: id },
        { status: status }
    );
    req.flash('success', 'Đã thay đổi trạng thái tai khoản thành công');
    res.redirect("back");
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Account.findOne(
            { _id: id }
        );
        const roles = await Role.find(
            {deleted: false}
        );
        res.render('admin/pages/accounts/edit',{
            pageTitle: "Sửa tài khoản người dùng",
            record: record,
            roles: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.postEdit = async (req, res) => {
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id:{ $ne: id},
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);

        }else{
            delete req.body.password;
        }
        await Account.updateOne(
            { _id: req.params.id },
            req.body
        );
        req.flash('success', 'Sửa tài khoản thành công'); 
        res.redirect("back");
    }
    
};
