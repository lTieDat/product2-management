//[GET] /home
module.exports.index = async (req,res) =>{
    res.render('client/pages/home/index.pug',{
        title: 'Trang chu'
    });
}