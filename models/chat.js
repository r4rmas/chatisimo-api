const mongoose = require("mongoose");
const Message = require("./message");

const Chat = mongoose.Schema({
  _id: { type: String, required: true },
  history: { type: [Message], required: true },
});

module.exports = Chat;
