// tinh gia moi cho 1 array san pham
module.exports.priceNew_products = (products) =>{
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        item.discount =  item.discountPercentage.toFixed(0);
        return item;
    });
    return newProducts;
}

// tinh gia moi cho 1 san pham
module.exports.priceNew_product = (product) =>{
    const newPrice = (product.price - product.price * product.discountPercentage / 100).toFixed(0);
    const discount =  product.discountPercentage.toFixed(0);
    return {newPrice,discount};
}