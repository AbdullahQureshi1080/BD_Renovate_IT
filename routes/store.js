const router = require("express").Router();
const {
  getStoreDataValidation,
  getStoreDataSpecificCategoryValidation,
  getShopDataValidation,
  storePlaceOrderValidation,
  getUserOrdersValidaion,
  storeCancelOrderValidation,
} = require("../middleware/validation");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Shop = require("../models/Shop");
var mongoose = require("mongoose");

//  Get Store Data
router.post("/getStoreProducts", async (req, res) => {
  // console.log(req.body)
  const { error } = getStoreDataValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");
  const products = await Product.find();
  res.status(201).send(products);
});

//  Get Store Data - Specific Category
router.post("/getSpecificStoreProducts", async (req, res) => {
  // console.log(req.body)
  const { error } = getStoreDataSpecificCategoryValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");
  const products = await Product.find({ productCategory: req.body.category });
  res.status(201).send(products);
});

// Get Shop Data
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
    createdAt: shop.date,
  };
  // console.log(userPosts);
  res.status(201).send(shopData);
});

//  Place Order
router.post("/placeOrder", async (req, res) => {
  // console.log(req.body);
  const { error } = storePlaceOrderValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ _id: req.body.userId });
  const shop = await Shop.findOne({ _id: req.body.shopId });
  if (!user) res.status(400).send("Error placing an order try again later");
  //    For Order confirmation
  const newOrder = new Order({
    orderName: user.firstname,
    buyerId: req.body.userId,
    shopId: req.body.shopId,
    totalOrderCost: req.body.totalOrderCost,
    products: req.body.products,
    deliveryDetails: req.body.deliveryDetails,
    paymentType: "Cash on delivery",
  });

  try {
    const savedOrder = await newOrder.save();
    await Shop.updateOne(
      { _id: req.body.shopId },
      {
        $addToSet: {
          orders: {
            id: savedOrder._id,
            date: savedOrder.date,
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
    await User.updateOne(
      { _id: req.body.userId },
      {
        $addToSet: {
          storeOrders: {
            id: savedOrder._id,
            date: savedOrder.date,
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

    if (
      shop.previousOrders.length == 0 ||
      shop.orders.length > shop.previousOrders.length
    ) {
      await Shop.updateOne(
        { _id: req.body.shopId },
        {
          $addToSet: {
            previousOrders: {
              id: savedOrder._id,
              date: savedOrder.date,
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
    }
    res.status(201).send(savedOrder);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

//  Cancel Order
router.post("/cancelOrder", async (req, res) => {
  // console.log(req.body);
  const { error } = storeCancelOrderValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ _id: req.body.userId });
  // const shop = await Shop.findOne({ _id: req.body.shopId });
  if (!user) res.status(400).send("Error placing an order try again later");
  await Order.updateOne(
    { _id: req.body.orderId },
    {
      $set: {
        orderStatus: "Canceled",
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
    const updatedOrder = await Order.findOne({
      _id: req.body.orderId,
    });
    console.log(updatedOrder);
    res.status(201).send(updatedOrder);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

// Get User Orders

router.post("/getUserOrders", async (req, res) => {
  // console.log(req.body);
  const { error } = getUserOrdersValidaion(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");
  const orders = user.storeOrders;
  const orderIds = orders.map(({ id }) => id);
  const allOrders = await Order.find();
  const userOrders = allOrders.filter(({ _id }) => orderIds.includes(_id));
  // console.log("Order Ids", orderIds);
  // console.log("All Orders", allOrders);
  // console.log("User Orders", userOrders);
  // console.log(userPosts);
  res.status(201).send(userOrders);
});

module.exports = router;
