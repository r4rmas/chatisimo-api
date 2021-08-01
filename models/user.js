const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", User);
