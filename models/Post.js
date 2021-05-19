const mongoose = require("mongoose");

const postScheme = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  description: {
    type: String,
  },
  images: [String],
  documents: [String],
  bids: [],
  date: {
    type: Date,
    default: Date.now,
  },
  budget: {
    type: String,
  },
  creator: {
    type: String,
    required: true,
  },
  creatorImage: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postScheme);
