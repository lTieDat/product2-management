const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
// [GET] /chat
module.exports.index = async(req, res) => {
    const userId = res.locals.user.id;
    _io.once('connection', (socket) => {
        socket.once("CLIENT_SEND_MESSAGE", async (content)=>{
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
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