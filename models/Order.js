const mongoose = require("mongoose");

const orderScheme = new mongoose.Schema({
  shopId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  totalOrderCost: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    default: [],
  },

  deliveryDetails: {
    type: Object,
    required: true,
  },

  paymentType: {
    type: String,
    required: true,
  },

  orderStatus: {
    type: String,
    default: "Awaiting Confirmation",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderScheme);
