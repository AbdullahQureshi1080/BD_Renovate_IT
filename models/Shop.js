const mongoose = require("mongoose");

 const shopScheme = new mongoose.Schema({

  shopName: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  phoneNumber: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  image: {
    type: String,
  },
  shopCategory: {
    type: String,
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products:[],
  orders:[],
});
 
module.exports = mongoose.model("Shop", shopScheme);
