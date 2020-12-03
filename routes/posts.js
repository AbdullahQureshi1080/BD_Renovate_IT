const router = require("express").Router();
const User = require("../models/User");
// const User = require('../models/User');
// const {registerValidation,loginValidation} = require('../validation');
// const bcrypt = require("bcryptjs");
// const JWT = require('jsonwebtoken');
const verify = require('./verifyToken');

router.get("/", verify, (req,res)=>{
    res.send(req.user);
    // Can find any user and do what we want,
    // User.findOne()
//   res.json({posts:{
//       title:"Post",
//       description: "Data that you do not have access too if not logged in. "
//   }})
});


module.exports = router;
