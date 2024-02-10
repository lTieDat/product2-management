const Product= require('../../models/product.model');
const productHelper = require('../../helpers/priceNew_products');
const ProductCategory = require('../../models/product-category.model');
const { all } = require('../../router/client/home.router');
const helperproductCategory = require('../../helpers/product-cate');

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

//[GET] /products/:slugCategory
module.exports.productCategory = async (req,res) =>{
    const category = await ProductCategory.findOne(
        {slug: req.params.slugCategory, deleted: false}
    );
    
    
    const listSubCategory = await helperproductCategory.category(category._id);
    const listSubCategoryId = listSubCategory.map(sub => sub._id);
    try{
        const product = await Product.find({
            category: {
                $in: [category._id,...listSubCategoryId]
            },
            deleted: false
        }).sort({position: "desc"});
        const newProducts = productHelper.priceNew_products(product);
        res.render(`client/pages/products/productsearch.pug`,{
            title: category.title,
            message: `Danh sách sản phẩm có danh mục : ${category.title}`,
            products: newProducts
        });
        
    }catch(e){
        req.flash('error', 'Không tìm thấy danh mục sản phẩm');
        res.redirect(`/products`);
    }

}