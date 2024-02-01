module.exports =(query)=>{
    let objectSearch ={
        keyword: "",
        regex: ""
    };
    if(query.keyword && query.keyword.length>0){
        objectSearch.keyword= query.keyword;
        const regex = new RegExp(objectSearch.keyword,"i");
        objectSearch.regex= regex;
    }
    return objectSearch;
}