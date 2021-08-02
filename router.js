const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
require("dotenv/config");

router.post("/signin", async (req, res) => {
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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findById(req.body.username);
    if (!user) return res.json({ error: "Wrong username or password" });
    const isThePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isThePassword)
      return res.json({ error: "Wrong username or password" });
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.json({ token: token });
  } catch (error) {
    res.status(500);
  }
});

router.get("/auth", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ error: "User does not exists" });
    //I could remove the password but this way is funnier, trust me
    const userSafe = { ...user._doc, password: ":)" };
    res.json({ user: userSafe });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
