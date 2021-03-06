const mongoose = require("mongoose");

const bidScheme = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  bidAmount: {
    type: String,
    required: true,
  },
  bidderId: {
    type: String,
    required: true,
  },
  posterId: {
    type: String,
    required: true,
  },
  bidStatus: {
    type: String,
    default: "active",
  },
  bidCategory: {
    type: String,
    required: true,
  },
  bidTime: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bid", bidScheme);
