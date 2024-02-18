const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const uploadToCloudinary = require('../../helpers/uploadToCloudinary');
const socket = require('../../sockets/client/chat.socket');


// [GET] /chat
module.exports.index = async(req, res) => {
    // socket IO
    socket(res);
    // end socket IO
    
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