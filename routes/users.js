//recall express to get router
const express = require("express");
const router = express.Router();
//formidable already in index.js
const User = require("../models/User");

//to encrypt password
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

/* Crud --> Create: SIGNUP */

router.post("/user/sign_up", async (req, res) => {
  try {
    const unique = await User.find({ email: req.fields.email });
    if (!(req.fields.username && req.fields.password && req.fields.email))
      res.json({ message: "le formulaire n'est pas totalement rempli" });
    else if (unique.length !== 0)
      res.json({ message: "cet email est déjà utilisé" });
    else {
      const salt = uid2(64);
      const token = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const newUser = new User({
        email: req.fields.email,
        token: token,
        salt: salt,
        hash: hash,
        account: {
          username: req.fields.username,
          phone: req.fields.phone,
        },
      });
      await newUser.save();

      res.json({
        _id: newUser._id,
        token: newUser.token,
        account: newUser.account,
      });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

/* Connect : LOGIN */

router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (!user) res.json({ message: "user not found" });
    else {
      const hash = SHA256(req.fields.password + user.salt).toString(encBase64);
      if (hash === user.hash) {
        res.json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.json({ error: "unauthorized" });
      }
    }
  } catch (e) {
    res.json({ error: error.message });
  }
});

module.exports = router;
