module.exports.registerPost =(req,res,next) =>{
    if(!req.body.email){
        req.flash('info','Vui lòng nhập email');
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash('info','Vui lòng nhập mật khẩu');
        res.redirect("back");
        return;
    }
    if(!req.body.fullName){
        req.flash('info','Vui lòng nhập tên');
        res.redirect("back");
        return;
    }    
    next();
} 


//validate login   
module.exports.loginPost =(req,res,next) =>{
    if(!req.body.email){
        req.flash('info','Vui lòng nhập email');
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash('info','Vui lòng nhập mật khẩu');
        res.redirect("back");
        return;
    }
    next();
} 

//validate forgot password
module.exports.forgotPasswordPost =(req,res,next) =>{
    if(!req.body.email){
        req.flash('info','Vui lòng nhập email');
        res.redirect("back");
        return;
    }
    next();
}

//validate otp
module.exports.otpPost =(req,res,next) =>{
    if(!req.body.otp){
        req.flash('info','Vui lòng nhập mã OTP');
        res.redirect("back");
        return;
    }
    next();
}

//validate reset password
module.exports.resetPasswordPost =(req,res,next) =>{
    if(!req.body.password){
        req.flash('error','Vui lòng nhập mật khẩu mới');
        res.redirect("back");
        return;
    }
    if(!req.body.confirmPassword){
        req.flash('error','Vui lòng nhập lại mật khẩu mới');
        res.redirect("back");
        return;
    }
    if(req.body.password !== req.body.confirmPassword){
        req.flash('error','Mật khẩu không khớp');
        res.redirect("back");
        return;
    }
    next();

}