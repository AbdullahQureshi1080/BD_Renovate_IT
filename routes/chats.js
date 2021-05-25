const router = require("express").Router();
const User = require("../models/User.js");
const { chatValidation, emailValidation } = require("../middleware/validation");
var mongoose = require("mongoose");
// Create Chat

router.post("/createChat", async (req, res) => {
  console.log(req.body);
  const { error } = chatValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await User.updateOne(
    { email: req.body.senderEmail },
    {
      $addToSet: {
        chats: {
          id: req.body.chatId,
          //   date: savedPost.date,
        },
        // savedPost
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
    { email: req.body.recieverEmail },
    {
      $addToSet: {
        chats: {
          id: req.body.chatId,
          //   date: savedPost.date,
        },
        // savedPost
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
    const updatedUser = await User.findOne({
      email: req.body.senderEmail.toLowerCase(),
    });
    const sendData = {
      chats: updatedUser.chats,
    };
    console.log(sendData);
    res.status(201).send(sendData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete Chat

router.post("/deleteChat", async (req, res) => {
  const { error } = chatValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(req.body);
  // const user = await User.findOne({ email: req.body.email.toLowerCase() });
  // if (user) {
  await User.updateOne(
    { email: req.body.senderEmail },
    {
      // $pull: { posts:  {_id:mongoose.Types.ObjectId(req.body.id)}} ,
      $pull: { chats: { id: mongoose.Types.ObjectId(req.body.chatId) } },
    },

    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
        res.status(200).send("Removed Chat Id from User Chats");
      }
    }
  );
  await User.updateOne(
    { email: req.body.recieverEmail },
    {
      // $pull: { posts:  {_id:mongoose.Types.ObjectId(req.body.id)}} ,
      $pull: { chats: { id: mongoose.Types.ObjectId(req.body.chatId) } },
    },

    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
        res.status(200).send("Removed Chat Id from User Chats");
      }
    }
  );
  // } else {
  try {
    const updatedUser = await User.findOne({
      email: req.body.senderEmail.toLowerCase(),
    });
    const sendData = {
      chats: updatedUser.chats,
    };
    // console.log(sendData);
    res.status(201).send(sendData);
  } catch (err) {
    res.status(400).send(err);
  }
  // }
});

router.post("/getChatIds", async (req, res) => {
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(req.body);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    // console.log(user.chats);
    const chatIds = user.chats.map(({ id }) => id);
    res.status(200).send(chatIds);
  } else {
    res.status(400).send("User has no chats");
  }
});

module.exports = router;
