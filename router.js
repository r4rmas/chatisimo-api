const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
require("dotenv/config");

router.post("/signup", async (req, res) => {
  try {
    let user = await User.findById(req.body.username);
    if (user) return res.json({ error: "El usuario ya existe" });
    const hashed = await bcrypt.hash(req.body.password, 10);
    user = new User({
      _id: req.body.username,
      password: hashed,
    });
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.json({ token: token });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
