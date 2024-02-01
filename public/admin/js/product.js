//change status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
if(buttonChangeStatus.length>0){
    const formChangeStatus = document.querySelector('#form-change-status');
    const pathForm = formChangeStatus.getAttribute("data-path");
    buttonChangeStatus.forEach((button)=>{
        button.addEventListener("click",()=>{
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let statusChange = currentStatus == 'active' ?  'deactive' : 'active';
            const action = pathForm + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action; 
            formChangeStatus.submit();
            
        });
    });
};