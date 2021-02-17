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
  date: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("Post", postScheme);