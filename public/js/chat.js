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

// server return message
socket.on("SERVER_RETURN_MESSAGE", (data)=>{
    const myId= document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    let htmlFullName ="";
    if(myId == data.userId){
        div.classList.add("inner-outgoing");
    }else{
        htmlFullName = `<div class="inner-name my-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">
            ${data.content}
        </div>
    `;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
});
// end server return message

// fix scroll chat to the last message
const bodyChat = document.querySelector(".chat .inner-body"); 
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end fix scroll chat to the last message