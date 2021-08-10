const mongoose = require("mongoose");

const Message = mongoose.Schema({
  _id: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = Message;
