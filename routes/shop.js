const router = require("express").Router();
const Shop = require("../models/Shop");
const {
  registerShopValidation,
  loginShopValidation,
  addProductValidation,
  updateShopProfileImage,
  getShopDataValidation,
  updateShopDataValidation,
  getShopProductsValidation,
  deleteProductValidation,
  confirmShopOrderValidation,
} = require("../middleware/validation");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
var mongoose = require("mongoose");

// Register Route
router.post("/register", async (req, res) => {
  // Validate data of shop
  const { error } = registerShopValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  Check for if user already exists in database
  const emailExist = await Shop.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (emailExist)
    return res.status(400).send({ error: "Email already exists" });

  // Hash the Password
  // String with complexity of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new Shop
  const shop = new Shop({
    shopName: req.body.shopName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
  });
  try {
    const savedShop = await shop.save();
    res.status(201).send(savedShop);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login  Route
router.post("/login", async (req, res) => {
  // Validate data of user
  const { error } = loginShopValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email exists
  const shop = await Shop.findOne({ email: req.body.email.toLowerCase() });
  if (!shop) return res.status(400).send("Email does not exists");

  // Check if Password is correct
  const validPassword = await bcrypt.compare(req.body.password, shop.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //  Create and assign a token
  const token = JWT.sign(
    {
      _id: shop._id,
      shopName: shop.shopName,
      phoneNumber: shop.phoneNumber,
      email: shop.email,
      about: shop.about,
      location: shop.location,
      image: shop.image,
      shopCategory: shop.shopCategory,
      products: shop.products,
      orders: shop.orders,
      createdAt: shop.date,
    },

    process.env.TOKEN_SECRET
  );
  res.send(token);
});

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
    shopName: shop.shopName,
    shopImage: shop.image,
    shopId: shop._id,
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
          },
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

// Delete Product

router.post("/deleteProduct", async (req, res) => {
  const { error } = deleteProductValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  const shop = await Shop.findOne({ _id: req.body.shopId });
  if (shop) {
    await Product.deleteOne({ _id: req.body.productId }, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(400).send("An Error Occured", err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    });
    await Shop.updateOne(
      { _id: req.body.shopId },
      {
        $pull: {
          products: { id: mongoose.Types.ObjectId(req.body.productId) },
        },
      },

      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
          res.status(200).send("Removed Post Id from User Posts");
        }
      }
    );
  } else {
    res.send("User does not exist");
  }
});

// Updating Profile Image

router.post("/updateProfileImage", async (req, res) => {
  const { error } = updateShopProfileImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);

  await Shop.updateOne(
    { _id: req.body.shopId },
    {
      $set: {
        image: req.body.image,
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
  try {
    const updatedShop = await Shop.findOne({
      _id: req.body.shopId,
    });
    console.log(updatedShop);
    res.status(201).send(updatedShop);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

//  Get Shop Data
router.post("/getShopData", async (req, res) => {
  // console.log(req.body)
  const { error } = getShopDataValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const shop = await Shop.findOne({
    _id: req.body.shopId,
  });
  if (!shop) res.status(400).send("Shop does not exist");
  const shopData = {
    _id: shop._id,
    shopName: shop.shopName,
    phoneNumber: shop.phoneNumber,
    email: shop.email,
    about: shop.about,
    location: shop.location,
    image: shop.image,
    shopCategory: shop.shopCategory,
    products: shop.products,
    orders: shop.orders,
    createdAt: shop.date,
  };
  // console.log(userPosts);
  res.status(201).send(shopData);
});

//  Update Shop Data
router.post("/updateShopData", async (req, res) => {
  const { error } = updateShopDataValidation(req.body);
  // console.log(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await Shop.updateOne(
    { _id: req.body.shopId },
    {
      $set: {
        shopName: req.body.data.shopName,
        location: req.body.data.city,
        phoneNumber: req.body.data.phoneNumber,
        about: req.body.data.about,
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
  try {
    const updatedShop = await Shop.findOne({
      _id: req.body.shopId,
    });
    const sendData = {
      _id: updatedShop._id,
      shopName: updatedShop.shopName,
      phoneNumber: updatedShop.phoneNumber,
      email: updatedShop.email,
      about: updatedShop.about,
      location: updatedShop.location,
      image: updatedShop.image,
      shopCategory: updatedShop.shopCategory,
      products: updatedShop.products,
      orders: updatedShop.orders,
      createdAt: updatedShop.date,
    };
    // console.log(sendData);
    res.status(201).send(sendData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get Shop Products
router.post("/getShopProducts", async (req, res) => {
  // console.log(req.body)
  const { error } = getShopProductsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const shop = await Shop.findOne({
    _id: req.body.shopId,
  });
  if (!shop) res.status(400).send("Shop does not exist");
  const products = shop.products;
  const productIds = products.map(({ id }) => id);
  const allProducts = await Product.find();
  const shopProducts = allProducts.filter(({ _id }) =>
    productIds.includes(_id)
  );
  console.log("Product Ids", productIds);
  console.log("All Products", allProducts);
  console.log("Shop Products", shopProducts);
  // console.log(userPosts);
  res.status(201).send(shopProducts);
});

// Confirm Shop Order
router.post("/confirmOrder", async (req, res) => {
  // console.log(req.body)
  const { error } = confirmShopOrderValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const shop = await Shop.findOne({
    _id: req.body.shopId,
  });
  if (!shop) res.status(400).send("Shop does not exist");
  // Logic for Confirm Order
  await Order.updateOne(
    { _id: req.body.orderId },
    {
      $set: {
        orderStatus: req.body.orderStatus,
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
  try {
    const updatedShop = await Shop.findOne({
      _id: req.body.shopId,
    });
    const updatedOrders = {
      orders: updatedShop.orders,
    };
    // console.log(sendData);
    res.status(201).send(updatedOrders);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
