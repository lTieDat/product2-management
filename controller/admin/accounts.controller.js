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

// [POST] /admin/accounts/create
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
 