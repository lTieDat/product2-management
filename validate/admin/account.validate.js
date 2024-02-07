module.exports.createPost =(req,res,next) =>{
    if(!req.body.fullName){
        req.flash('info','Vui lòng nhập tên');
        res.redirect("back");
        return;
    }
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
    if(!req.body.phone){
        req.flash('info','Vui lòng nhập số điện thoại');
        res.redirect("back");
        return;
    }
    
    next();
} 