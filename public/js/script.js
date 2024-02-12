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
