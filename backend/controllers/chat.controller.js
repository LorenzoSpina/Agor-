const Chat = require("../models/chat.model");
const User = require("../models/user.model");

function handelError(err,res) {
  console.log(err)
  return res.status('Error');
}

//@description      Prende le chat per un utente
//@route            GET /getmsg
//@access           Protected
const getMessages = async(req, res) => {
    //try {
        const { from, to } = req.query;
    
        let messages = null;
        await Chat.find({
          users: {
            $all: [from, to],
          },
        }, async (err, result) => {
          if(err) handelError(err, res)
          messages = await result;
          const projectedMessages = messages.map((msg) => {
            return {
              fromSelf: msg.sender.toString() === from,
              message: msg.message.text,
            };
          });
          res.json(projectedMessages);
        }).clone()
        //.sort({ updatedAt: 1 });
    
        
    /*} catch (error) {
        res.status(400).send(error.message)
    }*/
    
}

//@description      Crea una chat 1 to 1
//@route            POST /addmsg
//@access           Protected
const addMessage = async(req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Chat.create({
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