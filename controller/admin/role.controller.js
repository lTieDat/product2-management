// [GET] /admin/roles
const Role = require("../../models/roles.model.js");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
    let find={
        deleted: false
    };
    const records = await Role.find(find);
    res.render("admin/pages/role/index.pug",{
        pageTitle: "Trang quản lý vai trò",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create.pug",{
        pageTitle: "Trang tạo mới vai trò"
    })
}

// [POST] /admin/roles/createPost
module.exports.postCreate = async (req, res) => {
    const newRole = new Role(req.body);
    await newRole.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req,res) =>{
    try{
        const id = req.params.id;
        let find ={
            _id:id,
            deleted: false
        }
        const record = await Role.findOne(find);
        res.render("admin/pages/role/edit.pug",{
            pageTitle: "Trang chỉnh sửa vai trò",
            record: record
        })       
    }catch(e){  
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.patchEdit = async (req,res) =>{
    try{
        const id = req.params.id;
        await Role.updateOne({_id: id}, req.body);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }catch(e){  
        res.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    }
    res.redirect("back");
}
