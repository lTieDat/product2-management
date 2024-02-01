module.exports =(objectPagination,query,countProduct)=>{
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    //cong thuc tinh pagination
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    //tinh so pages
    
    const totalPage = Math.ceil(countProduct / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}