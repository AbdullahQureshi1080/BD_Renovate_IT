const mongoose = require("mongoose");

const productScheme = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  productDescription: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  productPrice: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  productImage: {
    type: String,
    required: true,
  },

  productCategory: {
    type: String,
  },

  shopName: {
    type: String,
  },
  shopId: {
    type: String,
  },
  shopImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productScheme);
