const mongoose = require("mongoose");

const userScheme = new  mongoose.Schema({
    googleId:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
        min:6,
        max:255,
    },
    lastname:{
        type:String,
        required:true,
        min:6,
        max:255,
    },
    email:{
        type:String,
        required:true,
        max:255,
        min:6
    },
    image:{
        type:String
    },
    password:{
        type:String,
        required: true,
        max:1024,
        min:6,
    },
    retypepassword:{
        type:String,
        required: true,
        max:1024,
        min:6,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("User",userScheme);