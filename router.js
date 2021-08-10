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
    user = new User({ _id: req.body.username, password: hashed });
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
    if (!user) return res.json({ error: "Usuario o contraseña incorrecta" });
    const isThePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isThePassword)
      return res.json({ error: "Usuario o contraseña incorrecta" });
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.json({ token: token });
  } catch (error) {
    res.status(500);
  }
});

router.post("/send/request", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const requester = await User.findById(decoded.id);
    const user = await User.findById(req.body.username);

    if (!requester) return res.json({ error: "Remitente no existe" });
    if (!user) return res.json({ error: "Usuario no existe" });

    const alreadySend = user.requests.includes(requester.id);
    if (alreadySend)
      return res.json({ error: "Solicitud de amistad enviada anteriormente" });

    const alreadyFriends = user.friends.includes(requester.id);
    if (alreadyFriends)
      return res.json({ error: `${user.id} y tú ya son amigos` });

    user.requests = [...user.requests, requester.id];
    await user.save();
    res.json({ success: "Solicitud de amistad enviada" });
  } catch (error) {
    res.status(500);
  }
});

router.post("/send/message", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const sender = await User.findById(decoded.id);
    const receiver = await User.findById(req.body.receiver);

    if (!sender) return res.json({ error: "Remitente no existe" });
    if (!receiver) return res.json({ error: "Usuario no existe" });

    const message = { _id: sender.id, message: req.body.message };

    //FUNCIONAAAAAAA!!! :)))

    const chat = sender.chats.filter((chat) => chat.id === receiver.id);
    const chatExists = chat.length > 0;

    if (chatExists) {
      sender.chats.map((chat) => {
        if (chat.id === receiver.id) {
          chat.history.push(message);
        }
      });
      receiver.chats.map((chat) => {
        if (chat.id === sender.id) {
          chat.history.push(message);
        }
      });
    } else {
      sender.chats = [
        ...sender.chats,
        { _id: receiver.id, history: [message] },
      ];
      receiver.chats = [
        ...receiver.chats,
        { _id: sender.id, history: [message] },
      ];
    }

    await sender.save();
    await receiver.save();
    res.json({ success: "Mensaje enviado" });
  } catch (error) {
    res.status(500);
  }
});

router.post("/accept/request", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ error: "Usario no existe" });
    const requester = await User.findById(req.body.username);
    if (!requester) return res.json({ error: "Remitente no existe" });
    user.requests = user.requests.filter((request) => request !== requester.id);
    user.friends = [...user.friends, requester.id];
    requester.friends = [...requester.friends, user.id];
    await user.save();
    await requester.save();
  } catch (error) {
    res.status(500);
  }
});

router.post("/decline/request", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ error: "Usario no existe" });
    const requester = await User.findById(req.body.username);
    if (!requester) return res.json({ error: "Remitente no existe" });
    user.requests = user.requests.filter((request) => request !== requester.id);
    await user.save();
  } catch (error) {
    res.status(500);
  }
});

router.get("/auth", async (req, res) => {
  try {
    const decoded = jwt.verify(req.get("auth-token"), process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ error: "Usuario no existe" });
    //I could remove the password but this way is funnier, trust me
    const userSafe = { ...user._doc, password: ":)" };
    res.json({ user: userSafe });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
