const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
// [GET] /chat
module.exports.index = async(req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content)=>{
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
            // show data in client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
            //end show data in client
        });
    });
    // get all chat
    const chat = await Chat.find({
        deleted: false
    });
    for(const item of chat){
        const user = await User.find({
            _id: item.user_id,
            deleted: false
        }).select('fullName');
        item.infoUser = user;
    }
    // end get all chat

    
    res.render('client/pages/chat/index', {
        title: 'Chat',
        chat: chat
    });
}