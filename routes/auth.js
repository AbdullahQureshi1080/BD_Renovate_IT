const router = require("express").Router();
const User = require('../models/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const passport = require("passport");
const cookieSession = require('cookie-session')

// General
router.get('/',(req,res)=>{
    res.send(
        "User Authentication"
    )
})
// Register Route
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

// Login  Route
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
        res.header('auth-token',token).send(token);

        // res.send("Loggin in !");
})


const islogged = (req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}

// Auth with Google
router.get('/google', passport.authenticate('google', {scope:['profile']}))

// Google auth callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/failed'}), 
 (req,res) =>{
    res.redirect('/good')
})

router.get('/failed', (req,res)=>{
    res.send("Authentication Failed")
})
router.get('/good', islogged , (req,res)=>{
    res.send(`Authentication Success, Welcome to RenovateIT ${req.user.displayName}`)
})

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

module.exports = router;
