const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const User = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: Array,
    required: false,
  },
  requests: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("users", User);
