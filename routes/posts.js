const router = require("express").Router();
const {
  newPostValidation,
  updatePostValidation,
  deletePostValidation,
} = require("../middleware/validation");
const User = require("../models/User");
const Post = require("../models/Post");
var mongoose = require("mongoose");
 
// Creating a new post
router.post("/newPost", async (req, res) => {
  const { error } = newPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) res.send("User does not exist, invalid email");
  console.log(req.body);
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    images: req.body.images,
    documents: req.body.documents,
  });
 
  try {
    const savedPost = await newPost.save();
    await User.updateOne(
      { email: req.body.email },
      {
        $addToSet: {
          posts: {
            id: savedPost._id,
            date: savedPost.date,
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
    res.status(201).send(savedPost);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }

});
 
// Updating a post
 
router.post("/updatePost", async (req, res) => {
  const { error } = updatePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
 
  await Post.updateOne(
    { _id: req.body.id },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        budget: req.body.budget,
        images: req.body.images,
        documents: req.body.documents,
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
    const updatedPost = await Post.findOne({
      _id: req.body.id,
    });
    console.log(updatedPost);
    res.status(201).send(updatedPost);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});
 
// Deleteing a post
 
router.post("/deletePost", async (req, res) => {
  const { error } = deletePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    await Post.deleteOne({ _id: req.body.id }, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(400).send("An Error Occured", err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    });
    await User.updateOne(
      { email: req.body.email },
      {
        $pull: { posts: { id: mongoose.Types.ObjectId(req.body.id) } },
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
 
module.exports = router;
 

 

