
const ProductCategory = require('../models/product-category.model');

module.exports.category = (parentID) =>{
    const getCate = async (parentID) =>{
        const subs = await ProductCategory.find({
            parentID: parentID,
            deleted: false,
            status: "active"
        });
        let allSubs = [... subs];
        for(const sub of subs){
            const child = await getCate(sub._id);
            allSubs = allSubs.concat(child);
        }
    
        return allSubs;
    }
    const result = getCate(parentID);
    return result;
}