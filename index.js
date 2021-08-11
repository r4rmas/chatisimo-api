const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router");
require("dotenv/config");

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to database")
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening at http://localhost:3000")
);
