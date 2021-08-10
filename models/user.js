const mongoose = require("mongoose");
const Chat = require("./chat");

const User = mongoose.Schema({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  friends: { type: Array, required: false },
  requests: { type: Array, required: false },
  chats: { type: [Chat], required: false },
});

module.exports = mongoose.model("users", User);
