const router = require("express").Router();
const User = require("../models/User.js");
const {
  updateValidation,
  getValidation,
  updateNormalValidation,
} = require("../middleware/validation");

router.post("/updateProfile", async (req, res) => {
  console.log(req.body);
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await User.updateOne(
    { email: req.body.email },
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        location: req.body.location,
        about: req.body.about,
        jobtitle: req.body.jobtitle,
        jobcategory: req.body.jobcategory,
        image: req.body.image,
        profileStatus: req.body.profileStatus,
        // posts:req.body.posts,
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
      email: req.body.email.toLowerCase(),
    });
    const sendData = {
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      about: updatedUser.about,
      location: updatedUser.location,
      jobtitle: updatedUser.jobtitle,
      jobcategory: updatedUser.jobcategory,
      image: updatedUser.image,
      chats: updatedUser.chats,
      firms: updatedUser.firms,
      profileStatus: updatedUser.profileStatus,
    };
    // console.log(sendData);
    res.status(201).send(sendData);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/updateNormalProfile", async (req, res) => {
  console.log(req.body);
  const { error } = updateNormalValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await User.updateOne(
    { email: req.body.email },
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        image: req.body.image,
        profileStatus: req.body.profileStatus,
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
      email: req.body.email.toLowerCase(),
    });
    const sendData = {
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      about: updatedUser.about,
      location: updatedUser.location,
      jobtitle: updatedUser.jobtitle,
      jobcategory: updatedUser.jobcategory,
      image: updatedUser.image,
      chats: updatedUser.chats,
      firms: updatedUser.firms,
      profileStatus: updatedUser.profileStatus,
    };
    // console.log(sendData);
    res.status(201).send(sendData);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/getProfile", async (req, res) => {
  const { error } = getValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");

  const sendData = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    about: user.about,
    location: user.location,
    jobtitle: user.jobtitle,
    jobcategory: user.jobcategory,
    image: user.image,
    chats: user.chats,
    firms: user.firms,
    profileStatus: user.profileStatus,
    // posts:user.posts,
  };
  res.status(201).send(sendData);
});

module.exports = router;
