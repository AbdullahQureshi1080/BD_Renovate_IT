const router = require("express").Router();
const {
  saveValidation,
  unSaveValidation
  savedItemsValidation,
} = require("../middleware/validation");
const User = require("../models/User");
const Project = require("../models/Project");
var mongoose = require("mongoose");

router.post("/save", async (req, res) => {
  // console.log(req.body);
  const { error } = saveValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find({ _id: req.body.userId });
  if (!user) res.status(400).send("User does not exist");
  await User.updateOne(
    { _id: req.body.userId },
    {
      $addToSet: {
        saved: {
          _id: mongoose.Types.ObjectId(),
          image: req.body.image,
          date: new Date(),
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
    const user = await User.findOne({
      _id: req.body.userId,
    });
    const saves = user.saved;
    res.status(201).send(saves);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});


router.post("/unSave", async (req, res) => {
  // console.log(req.body);
  const { error } = unSaveValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find({ _id: req.body.userId });
  if (!user) res.status(400).send("User does not exist");
  await User.updateOne(
    { _id: req.body.userId },
    {
        $pull: { saved: { _id: mongoose.Types.ObjectId(req.body.itemId) } },
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
    const user = await User.findOne({
      _id: req.body.userId,
    });
    const saves = user.saved;
    res.status(201).send(saves);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});


router.post("/getSavedItems", async (req, res) => {
  // console.log(req.body);
  const { error } = savedItemsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find({ _id: req.body.userId });
  if (!user) res.status(400).send("User does not exist");
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });
    const saves = user.saved;
    res.status(201).send(saves);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

module.exports = router;
