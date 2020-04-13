const express = require("express");
const router = express.Router();
const createStripe = require("stripe");
const stripe = createStripe(process.env.TRIPE_KEY);
const server = express();

server.post("/payment", async (req, res) => {
  try {
    //sending amount (in cents !) and token to stripe
    const { status } = await stripe.charges.create({
      amount: req.fields.amount,
      currency: "eur",
      description: req.fields.description,
      source: req.fields.token,
    });

    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

module.exports = router;
