const mongoose = require("mongoose")

const chatModel = mongoose.Schema(
    {
        message: {
          text: { type: String, required: true },
        },
        users: Array,
        sender: {
          type: mongoose.Schema.Types.String,
          ref: "User",
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat