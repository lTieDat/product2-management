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