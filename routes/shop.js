const router = require("express").Router();
const Shop = require('../models/Shop');
const {registerShopValidation,loginShopValidation,addProductValidation} = require('../middleware/validation');
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const Product = require("../models/Product");
// const passport = require("passport");



// Register Route
router.post("/register", async (req,res)=>{
    
    // Validate data of shop
    const {error} = registerShopValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //  Check for if user already exists in database
    const emailExist = await Shop.findOne({email:req.body.email.toLowerCase()});
    if(emailExist) return res.status(400).send({error:"Email already exists"});

    // Hash the Password
    // String with complexity of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt); 

    // Create a new Shop
    const shop = new Shop({
        shopName:req.body.shopName,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email.toLowerCase(),
        password:hashedPassword,
    });
    try {
        const savedShop = await shop.save();
            res.status(201).send(savedShop);
    }catch(err){
        res.status(400).send(err)
    }
});

// Login  Route
router.post("/login",async (req,res)=>{
        // Validate data of user
        const {error} = loginShopValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        // Checking if email exists
        const shop = await Shop.findOne({email:req.body.email.toLowerCase()});
        if(!shop) return res.status(400).send("Email does not exists");

        // Check if Password is correct
        const validPassword = await bcrypt.compare(req.body.password, shop.password);
        if(!validPassword) return res.status(400).send("Invalid Password");

        //  Create and assign a token
        const token = JWT.sign(
            {
                _id: shop._id,
                shopName: shop.shopName,
                phoneNumber: shop.phoneNumber,
                email: shop.email,
                about: shop.about,
                location: shop.location,
                image:shop.image,
                shopCategory:shop.shopCategory,
                products:shop.products,
                orders:shop.orders,
                createdAt:shop.date,
              },

            process.env.TOKEN_SECRET); 
        res.send(token);
})

// Adding a new product
router.post("/addProduct", async (req, res) => {
    // console.log(req.body);
    const { error } = addProductValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  const shop = await Shop.findOne({ email: req.body.email.toLowerCase() });
  if (!shop) res.send("Shop does not exist, invalid email");
  const newProduct = new Product({
    productName: req.body.productName,
    productDescription: req.body.productDescription,
    productCategory: req.body.productCategory,
    productPrice: req.body.productPrice,
    productImage: req.body.productImage,
    shopName:shop.shopName,
    shopNameImage:shop.image,
  });
 
  try {
    const savedProduct = await newProduct.save();
    await Shop.updateOne(
      { email: req.body.email },
      {
        $addToSet: {
          products: {
            id: savedProduct._id,
            date: savedProduct.date,
          }
        },
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    res.status(201).send(savedProduct);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }

});


module.exports = router;
