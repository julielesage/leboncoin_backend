const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());

const createStripe = require("stripe");
const stripe = createStripe(process.env.TRIPE_KEY);

router.post("/payment", async (req, res) => {
  try {
    //sending amount (in cents !) and token to stripe
    const { status } = await stripe.charges.create({
      amount: req.fields.amount,
      currency: "eur",
      description: `Paiement leboncoin pour : ${req.fields.title}. Id du produit ${req.fields.productId}`,
      source: req.fields.token,
    });

    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

module.exports = router;
