const User = require('../../models/user.model');
const md5 = require('md5');
const forgotPassword = require('../../models/forgotPassword');
const generate = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendmail');


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
    const subject = "Mã OTP đổi mật khẩu";
    const html =
                `Mã OTP của bạn là: <b>${newOTP} </b>,
                thời hạn 3 phút</b>`;
    sendMailHelper.sendMail(email,subject,html);
    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otp = async(req,res) =>{
    const email = req.query.email;
    res.render('client/pages/user/otp-password',{
        pageTitle: "Nhập OTP",
        email: email
    });
} 

//[POST] /user/password/otp
module.exports.otpPost = async(req,res) =>{
    const email = req.body.email;
    const otp = req.body.otp;
    const query = await forgotPassword.findOne({
        email: email,
        otp: otp,
    });
    if(!query){
        req.flash("error", "Mã OTP không đúng");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    }).select("tokenUser");
    res.cookie("tokenUser",user.tokenUser);
    res.redirect(`/user/password/reset?email=${email}`);
}

//[GET] /user/password/reset
module.exports.resetPassword = async(req,res) =>{
    // const email = req.query.email;
    res.render('client/pages/user/reset-password',{
        pageTitle: "Đổi mật khẩu",
    });
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async(req,res) =>{
    const password = req.body.password;
    const userToken = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: userToken,
    },{
        password : md5(password) 
    }
    );
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect("/");
}