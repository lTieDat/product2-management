const uploadToCloudinary = require('../../helpers/uploadToCloudinary');
const Chat = require('../../models/chat.model');

module.exports = (res) =>{
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data)=>{
            let images = [];
            for (const item of data.images) {
                const link = await uploadToCloudinary(item);
                images.push(link);
            }
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });
            await chat.save();
            // show data in client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images 
            });
            //end show data in client
        });
        // typing
        socket.on("CLIENT_TYPING", async (data)=>{
            socket.broadcast.emit("SERVER_TYPING", {
                userId: userId,
                fullName: fullName,
                type: data
            });
        });
    });
}