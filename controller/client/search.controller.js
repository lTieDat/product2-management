const Product = require("../../models/product.model");
const productHelper = require("../../helpers/priceNew_products");
// [GET] /client/search
module.exports.index = async(req, res) => {
    const keyword = req.query.keyword;
    let products = [];
    if(keyword){
        const regex = new RegExp(keyword, "i");
        const productQuery = await Product.find(
            {
                title: regex,
                status: "active",
                deleted: false
            }
        );
        for (const product of productQuery) {
            const query = productHelper.priceNew_product(product);
            const newDiscount = query.discount;
            const newPrice = query.newPrice;
            product.newPrice = newPrice;
            product.discount = newDiscount;
        }
        products = productQuery;
    };
    
    res.render("client/pages/search",
    {  title: "Tìm kiếm sản phẩm" ,
        keyword: keyword,
        products: products
    });
}