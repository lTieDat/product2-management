const User = require('../../models/user.model');
const md5 = require('md5');
const forgotPassword = require('../../models/forgotPassword');
const generate = require('../../helpers/generate');

//[GET] /user/register
module.exports.register = async(req,res) =>{
    res.render('client/pages/user/register',{
        pageTitle: "Đăng ký"
    });
}

//[POST] /user/register
module.exports.registerPost = async(req,res) =>{
    const existEmail = await User.findOne({
        email: req.body.email,
    });
    if(existEmail){
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }
    if(req.body.password){
        req.body.password = md5(req.body.password);
    }
    const user = new User(req.body);
    await user.save();
    req.flash("success", "Đăng ký thành công");
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("back");
}

//[GET] /user/login
module.exports.login = async(req,res) =>{
    res.render('client/pages/user/login',{
        pageTitle: "Đăng nhập"
    });
}

//[POST] /user/login
module.exports.loginPost = async(req,res) =>{
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if(password !== user.password){
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }
    if(user.status !== "active"){
        req.flash("error", "Tài khoản chưa kích hoạt");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = async(req,res) =>{
    res.clearCookie("tokenUser");
    res.redirect("/");
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async(req,res) =>{
    res.render('client/pages/user/forgot-password',{
        pageTitle: "Quên mật khẩu"
    });
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async(req,res) =>{
    const email = req.body.email;
    const user = await User.findOne({
            email: email,
            deleted: false
    });
    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    //lưu thông tin mới
    const newOTP = generate.otp(10);
    const objectForgotPassword = {
        email: email,
        otp: newOTP,
        expiredAt: Date.now()
    };
    const forgotPasswordmodel = new forgotPassword(objectForgotPassword);
    await forgotPasswordmodel.save();
    // tồn tại email thì gửi OTP qua email
    res.redirect("/user/password/otp");
}