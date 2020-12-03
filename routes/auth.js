const router = require("express").Router();
const User = require('../models/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
router.post("/register", async (req,res)=>{
    
    // Validate data of user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //  Check for if user already exists in database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    // Hash the Password
         // String with complexity of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt); 

    // Create a new User
    const user = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        password:hashedPassword,
        retypepassword:hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err)
    }
});

router.post("/login",async (req,res)=>{
        // Validate data of user
        const {error} = loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        // Checking if email exists
        const user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("Email does not exists");

        // Check if Password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send("Invalid Password");

        //  Create and assign a token
        const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET); 
        res.header('auth-token',token)

        res.send("Loggin in !");
})



module.exports = router;
