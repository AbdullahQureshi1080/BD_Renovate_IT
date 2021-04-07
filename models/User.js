const mongoose = require("mongoose");
// const {postScheme} = require('./Post');


 const userScheme = new mongoose.Schema({
 
  firstname: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  lastname: {
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
  jobtitle: {
    type: String,
  },
  jobcategory: {
    type: String,
  },
  location: {
    type: String,
  },
  about: {
    type: String,
    min: 20,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  posts:[],
  projects:[],
  chats:[],
  firms:[],
});
 
module.exports = mongoose.model("User", userScheme);
