const router = require("express").Router();
const User = require("../models/User.js");
const {
  userIdValidation,
  saveNotificationValidation,
} = require("../middleware/validation");
var mongoose = require("mongoose");

// Save Notification

router.post("/saveNotification", async (req, res) => {
  const { error } = saveNotificationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(req.body);
  const user = await User.findOne({ _id: req.body.userId });
  if (user) {
    await User.updateOne(
      { _id: req.body.userId },
      {
        $addToSet: {
          notifications: {
            _id: mongoose.Types.ObjectId(),
            message: req.body.message,
            userName: `${user.firstname} ${user.lastname}`,
            userImage: user.image,
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
    try {
      const updatedUser = await User.findOne({
        _id: req.body.userId,
      });
      // console.log(updatedProject.comments);
      const notifications = updatedUser.notifications;
      res.status(201).send(notifications);
    } catch (err) {
      res.status(400).send("An Error Occured", err);
    }
  } else {
    res.status(400).send("User does not exist");
  }
});

// Get Notification

router.post("/getNotifications", async (req, res) => {
  const { error } = userIdValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(req.body);
  const user = await User.findOne({ _id: req.body.userId });
  if (user) {
    // console.log(user);
    const notifications = user.notifications;
    res.status(200).send(notifications);
  } else {
    res.status(400).send("User does not exist");
  }
});

module.exports = router;
