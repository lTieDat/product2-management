const systemConfig = require("../../config/system");
const Account = require("../../models/account.model.js");
const Role = require("../../models/roles.model.js");
const md5 = require('md5');
// [GET] /admin/my-account/
module.exports.myAccount = async (req, res) => {
    res.render('admin/pages/my-account/index.pug', {
        pageTitle: 'My Account',
    });
};

// [GET] /admin/my-account/edit
module.exports.editMyAccount = async (req, res) => {
    res.render('admin/pages/my-account/edit.pug', {
        pageTitle: 'Edit My Account',
    });
};

// [POST] /admin/my-account/edit
module.exports.postEditMyAccount = async (req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id:{ $ne: id},
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash('error', `Email ${req.body.email} đã tồn tại`);

    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }
        await Account.updateOne(
            { _id: id },
            req.body
        );
        req.flash('success', 'Sửa tài khoản thành công'); 
        
    }
    res.redirect("back");
};
