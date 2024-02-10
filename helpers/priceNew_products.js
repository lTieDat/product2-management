module.exports.priceNew_products = (products) =>{
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        item.discount =  item.discountPercentage.toFixed(0);
        return item;
    });
    return newProducts;
}