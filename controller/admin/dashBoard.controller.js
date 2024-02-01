// [GET] /admin/dashBoard
module.exports.dashBoard = async (req, res) => {
    res.render("admin/pages/dashBoard/index.pug",{
        pageTitle: "DashBoard"
    })
}

