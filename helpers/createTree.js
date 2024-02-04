let count =0;
const createTree =  (arr, parentID ="")=>{
    const tree =[];
    arr.forEach(item => {
        if(item.parentID === parentID){
            count++;
            const newItem = item;
            newItem.index = count;
            const children = createTree(arr, item.id);
            if(children.length>0){
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports.tree =(arr, parentID ="") =>{
    count=0;
    const tree= createTree(arr, parentID ="");
    return tree;
}
