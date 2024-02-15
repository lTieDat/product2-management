 const User = require('../../models/user.model');
const md5 = require('md5');

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