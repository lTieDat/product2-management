// button status
const buttonStatus =document.querySelectorAll("[button-status]");
if(buttonStatus.length >0){
    let url = new URL(window.location.href);
    buttonStatus.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const status = btn.getAttribute("button-status");
            if(status){
                url.searchParams.set("status",status);
            }
            else{
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}

// form search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit",(event)=>{
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set("keyword",keyword);
        }
        else{
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;

    });
}
//end form search

//pagination
const pagination = document.querySelectorAll("[button-pagination]");
if(pagination){
    let url = new URL(window.location.href);
    pagination.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const page = btn.getAttribute("button-pagination");
            if(page){
                url.searchParams.set("page",page);
            }
            else{
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        })
    })
}

//multi check-box fill
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if(checkBoxMulti){
    const checkAll = checkBoxMulti.querySelector("input[name='checkall']");
    const inputIds = checkBoxMulti.querySelectorAll("input[name='id']");
    //them su kien checkAll
    checkAll.addEventListener("click",()=>{
        if(checkAll.checked){
            inputIds.forEach((input)=>{
                input.checked = true;
            });
        }else{
            inputIds.forEach((input)=>{
                input.checked = false;
            });
        }
    });

    //them su kien inputIds neu full thi check all
    inputIds.forEach((input)=>{
        input.addEventListener("click",()=>{
            const countChecked = checkBoxMulti.querySelectorAll('input[name="id"]:checked').length;
            if(countChecked === inputIds.length){
                checkAll.checked = true;
            }else{
                checkAll.checked = false;
            }
        });
    });
};
//multi end check-box fill

//form change multi status to show id in search bar
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(event)=>{
        event.preventDefault();
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkBoxMulti.querySelectorAll('input[name="id"]:checked');
        
        
        //delete all
        const type = event.target.elements.type.value;
        if(type === "delete-all"){
            const confirmDelete = confirm("Ban co chac chan muon xoa tat ca san pham da chon khong?");
            if(!confirmDelete){
                return;
            }
        }
        if(inputChecked.length >0){
            let ids =[];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach((input)=>{
                if(type === "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${input.value}-${position}`);
                }else{
                    ids.push(input.value);
                }    
            });
            inputIds.value = ids.join(",");
            formChangeMulti.submit();
        }else{
            alert("vui long chon it nhat 1 san pham");
        }
    });
}

//delete item
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length >0){
    buttonDelete.forEach(button =>{
        const formDelete = document.querySelector("#form-delete-item");
        const path = formDelete.getAttribute("data-path");
        button.addEventListener("click",()=>{
            const confirmDelete = confirm("Ban co chac chan muon xoa san pham nay khong?");
            if(confirmDelete){
                const id =button.getAttribute("data-id");
                //them router vao ben router.js
                    const action =  `${path}/${id}?_method=DELETE`;
                    formDelete.action = action;
                    formDelete.submit();                    
            }else{

            }
        });
    });
};

//show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time=parseInt(showAlert.getAttribute("data-time"));
    const clossAlert = showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hide");
    }, time);

    clossAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hide");
    });
}
//end show alert

//upload image to preview
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput= uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview= uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change",(e)=>{
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
        const deleteImage = document.querySelector("[delete-image]");
        const deleteImg = deleteImage.querySelector("[upload-image-delete]");
        if(deleteImg){
            deleteImg.addEventListener("click",()=>{
                uploadImagePreview.src ="";
                uploadImageInput.value ="";
            });
        };
    });
    
};
//end upload image