const mongoose = require("mongoose");
 
const projectScheme = new mongoose.Schema({
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
  category: {
    type: String,
  },
  data: {},
  creator:{
       type:String,
       required:true,
   },
   creatorImage:{
       type:String,
   },
  comments:[],
  likes:[],
  date: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("Project", projectScheme);