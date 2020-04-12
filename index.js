require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary");

const server = express();
server.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //to make unique model:
  useCreateIndex: true,
});
server.use(cors());

cloudinary.config({
  cloud_name: "dqausabxf",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

server.get("/", function (req, res) {
  res.send("Welcome to the leboncoin API.");
});

const usersRoutes = require("./routes/users.js");
server.use(usersRoutes);
const offersRoutes = require("./routes/offers.js");
server.use(offersRoutes);

// for wrong path request :
server.all("*", function (req, res) {
  res.status(404).json({ error: "Page Not Found" });
});

server.listen(process.env.PORT, () => {
  console.log("leboncoin API running");
});
