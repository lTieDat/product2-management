// client send message
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener("submit",(e)=>{
        e.preventDefault();
        const content = e.target.elements.content.value;
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE",content);
            e.target.elements.content.value = "";
        }
    });
}
// end client send message