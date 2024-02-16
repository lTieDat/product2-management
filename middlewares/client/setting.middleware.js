const Setting = require('../../models/setting-general.model');

module.exports.settingGeneral = async(req,res,next) =>{
    const record = await Setting.findOne({});
    if(record){
        res.locals.settingGeneral = record;
    }
    next();
}