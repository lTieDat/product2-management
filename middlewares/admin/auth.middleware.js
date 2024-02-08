const systemConfig = require("../../config/system");
const Account = require("../../models/account.model.js");
const Role = require("../../models/roles.model.js");
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    }else{
        const user = await Account.findOne({
            token: req.cookies.token,
            deleted: false,
        }).select("-password");
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        else{
            const role = await Role.findOne({
                _id: user.role_id,
            }).select("title permissions");
            res.locals.role = role;
            res.locals.user = user;
            next();
        }
    }
};