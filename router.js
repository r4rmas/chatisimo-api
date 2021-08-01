const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("./models/user");

router.post("/signup", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashed,
    });
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
