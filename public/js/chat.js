import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
// file upload with preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-img',{
  multiple: true,maxFileCount: 6
});

// client send message
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray;
    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content : content,
        images : images
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel(); // clear all preview img
      socket.emit("CLIENT_TYPING", "hide");
    }
  });
}
// end client send message

// server return message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const boxTyping = document.querySelector(".chat .inner-list-typing");
  let htmlFullName = "";
  let htmlContent ="";
  let htmlImages = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name my-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }
  if(data.content){
    htmlContent = `
          ${htmlFullName}
          <div class="inner-content">
              ${data.content}
          </div>
      `;
  }
  if(data.images.length > 0){
    htmlImages += `<div class="inner-images">`;
    for (const item of data.images) {
      htmlImages +=  `<img src="${item}">`
    }
         
    htmlImages+=`</div>`;
      
  }
  div.innerHTML = `
          ${htmlFullName}
          ${htmlContent}
          ${htmlImages}
  `;
  // body.appendChild(div);
  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
  
  // preview full image
  const gallery = new Viewer(div);
  // end preview full image
});
// end server return message

// fix scroll chat to the last message
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end fix scroll chat to the last message

//show icon chat
// showpopup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// end showpopup

//show Typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_TYPING", "hide");
  }, 3000);
};
// end typing
// insert icon into input

const emojipicker = document.querySelector("emoji-picker");
if (emojipicker) {
  const input = document.querySelector(
    '.chat .inner-form input[name="content"]'
  );
  emojipicker.addEventListener("emoji-click", (event) => {
    input.value += event.detail.unicode;
    //set con tro chuot o cuoi input
    const end = input.value.length;
    input.setSelectionRange(end, end);
    input.focus();
    // end set con tro chuot o cuoi input
    showTyping();
  });

  input.addEventListener("keyup", () => {
    showTyping();
  });
}
// end insert icon into input
// end show icon chat

// server typing
const elementListTyping = document.querySelector(".chat .inner-list-typing");
console.log(elementListTyping);

if (elementListTyping) {
  socket.on("SERVER_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
                            <div class="inner-name"> ${data.fullName} </div>                        
                            <div class="inner-dots"> 
                                <span></span>    
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                `;

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (existTyping) {
        elementListTyping.removeChild(existTyping);
      }
    }
  });
}
// end server typing


//preview full image
const bodyInnerPreviewImg = document.querySelector(".chat .inner-body");
if (bodyInnerPreviewImg) {
    const gallery = new Viewer(bodyInnerPreviewImg);
}
// end preview full image