const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

//@description      Get all message
//@route            GET /message/:chatId
//@access           Protected
const allMessage = async(req, res) => {
    try {
        let messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//@description      Create new message
//@route            POST /message
//@access           Protected
const sendMessage = async(req, res) => {
    const { content, chatId } = req.body;
    if(!content || !chatId) {
        return res.status(400).send("Invalid data passed into request");
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name picture").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { allMessage,  sendMessage };