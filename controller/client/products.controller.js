const Product= require('../../models/product.model');
const productHelper = require('../../helpers/priceNew_products');
//[GET] /products
module.exports.products= async (req,res) =>{
    const products = await(Product.find({
    }).sort({position:"desc"}));
    const newProducts = productHelper.priceNew_products(products);
    res.render('client/pages/products/products.pug',{
        title: "San pham",
        products: newProducts
    }); 
};

//[GET] /products/:slug
module.exports.productDetail = async (req,res) =>{
    try{
        if(req.params.slug==="undefined"){
            req.flash('error', 'Không tìm thấy sản phẩm');
            res.redirect(`/products`);
            return;
        }
        const find ={
            slug : req.params.slug,
            deleted: false
        }
        const product = await Product.findOne(find);
        res.render(`client/pages/products/detail`,{
                pageTitle : "Chi tiết sản phẩm",
                product : product
        }); 
    }catch(e){
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`/products`);
    }
};