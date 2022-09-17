const Chat = require("../models/chat.model");
const User = require("../models/user.model");

//@description      Prende le chat per un utente
//@route            POST /newchat
//@access           Protected
const getMessages = async(req, res) => {
    try {
        const { from, to } = req.body;
    
        const messages = await Messages.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        res.json(projectedMessages);
    } catch (error) {
        res.status(400).send(error.message)
    }
    
}

//@description      Crea una chat 1 to 1
//@route            GET /getchats
//@access           Protected
const addMessage = async(req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });   
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    addMessage,
    getMessages
}