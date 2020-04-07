const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 5000,
  },
  price: {
    type: Number,
    min: 0,
    max: 100000,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  pictures: {
    type: Array,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Offer;
