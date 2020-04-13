const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dqausabxf",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//this function creates filters object, will be used later
const createFilters = (req) => {
  const filters = {};
  if (req.query.priceMin) {
    filters.price = {};
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    if (filters.price === undefined) filters.price = {};
    filters.price.$lte = req.query.priceMax;
  }
  if (req.query.title) {
    // i --> insensible to uppercase
    filters.title = new RegExp(req.query.title, "i");
  }
  return filters;
};

/* Crud --> Create */

router.post("/offer/upload", isAuthenticated, async (req, res) => {
  try {
    if (Object.keys(req.files).length > 0) {
      cloudinary.v2.uploader.upload(
        req.files.file.path,
        async (error, result) => {
          if (error) return res.json({ error: error.message });
          else {
            console.log("title req==>", req.fields.title);
            const newOffer = new Offer({
              title: req.fields.title,
              description: req.fields.description,
              price: req.fields.price,
              creator: req.user,
              pictures: result,
            });
            await newOffer.save();
            const boomerang = await Offer.find({ _id: newOffer._id }).populate({
              path: "creator",
              select: "_id",
              select: "account.username",
            });
            res.json(boomerang);
          }
        }
      );
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

/* cRud --> Read all searched offers */

router.get("/offers/with-count", async (req, res) => {
  try {
    const filters = createFilters(req);
    //filtered search :
    const search = Offer.find(filters);
    //sorted search by price
    if (req.query.sort === "price-asc") search.sort({ price: 1 });
    else if (req.query.sort === "price-desc") search.sort({ price: -1 });
    //sorted search by date
    if (req.query.sort === "date-asc") search.sort({ created: 1 });
    else if (req.query.sort === "date-desc") search.sort({ created: -1 });

    //pagination but pb if limit , offers count do change ...
    // as database/offers/with-count?page=2
    if (req.query.page & req.query.limit) {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      search.limit(limit).skip(limit * (page - 1));
    }
    // or as database/offers/with-count?skip=6&limit=3
    if (req.query.limit && req.query.skip) {
      const limit = Number(req.query.limit);
      const skip = Number(req.query.skip);
      search.limit(limit).skip(skip);
    }

    //result
    const offers = await search.populate({
      path: "creator",
      select: "account",
    });
    offers.reverse();
    res.json({
      count: offers.length,
      offers: offers,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

/* cRud --> Read one offer */

router.get("/offer/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(400).send({ message: "missing id" });
    else {
      const offerToGet = await Offer.findById(req.params.id).populate({
        path: "creator",
        select: "account",
      });

      res.json(offerToGet);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
