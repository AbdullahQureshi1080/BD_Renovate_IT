const mongoose = require("mongoose");

const firmScheme = new mongoose.Schema({
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
  members: [],
  notes: [],
  creator: {
    type: String,
    required: true,
  },
  creatorImage: {
    type: String,
  },
  creatorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// module.exports.postScheme = postScheme;
module.exports = mongoose.model("Firm", firmScheme);
