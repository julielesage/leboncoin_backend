require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const server = express();
server.use(formidableMiddleware());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //to make unique model:
  useCreateIndex: true,
});
server.use(cors());

server.get("/", function (req, res) {
  res.send("Welcome to the leboncoin API.");
});

const usersRoutes = require("./routes/users.js");
server.use(usersRoutes);
const offersRoutes = require("./routes/offers.js");
server.use(offersRoutes);
const paymentRoutes = require("./routes/payment.js");
server.use(paymentRoutes);

// for wrong path request :
server.all("*", function (req, res) {
  res.status(404).json({ error: "Page Not Found" });
});

server.listen(process.env.PORT, () => {
  console.log("leboncoin API running");
});
