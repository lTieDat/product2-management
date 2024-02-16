const Setting = require('../../models/setting-general.model');
//  [GET] /admin/setting
module.exports.index = async(req,res) =>{
    const record = await Setting.findOne({});
    if(record){
        res.render('admin/pages/setting/index',{
            pageTitle: "Cài đặt chung",
            record: record
        });
    }
    else{
        res.render('admin/pages/setting/index',{
            pageTitle: "Cài đặt chung",
            record: {}
        });
    }
    
}

//  [PATCH] /admin/setting
module.exports.updateGeneral = async(req,res) =>{
    const settingGeneral = await Setting.findOne({});
    if(settingGeneral){
        await Setting.updateOne(
            {_id: settingGeneral.id},req.body
        );
    }
    else{
        const setting = new Setting(req.body);
        await setting.save();
    }
    req.flash('success', 'Cập nhật thành công');
    res.redirect('back');
}