const router = require("express").Router();
const {
  newPostValidation,
  updatePostValidation,
  deletePostValidation,
  emailValidation,
  offerBidValidation,
  rejectBidValidation,
  acceptBidValidation,
  bidValidation,
  userBidValidation,
} = require("../middleware/validation");
const User = require("../models/User");
const Post = require("../models/Post");
const Bid = require("../models/Bid");
var mongoose = require("mongoose");

// Creating a new post
router.post("/newPost", async (req, res) => {
  const { error } = newPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) res.send("User does not exist, invalid email");
  const name = `${user.firstname} ${user.lastname}`;
  console.log(req.body);
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    images: req.body.images,
    documents: req.body.documents,
    creator: name,
    creatorImage: user.image,
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

// Biding on the post

router.post("/offerBid", async (req, res) => {
  console.log(req.body);
  const { error } = offerBidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const newBid = new Bid({
    bidderId: req.body.bidderId,
    message: req.body.message,
    bidAmount: req.body.bidAmount,
    bidCategory: req.body.bidCategory,
  });
  await Post.updateOne(
    { _id: req.body.postId },
    {
      $addToSet: {
        bids: newBid,
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
      _id: req.body.postId,
    });
    console.log(updatedPost);
    res.status(201).send(updatedPost);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

// Accept Bid on the post

router.post("/acceptBid", async (req, res) => {
  const { error } = acceptBidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  await Post.updateOne(
    { "bids._id": mongoose.Types.ObjectId(req.body.bidId) },
    {
      $set: {
        "bids.$.bidStatus": "Accepted",
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
  const post = await Post.findOne({ _id: req.body.postId });
  // const bids = post.bids;
  const bidIds = post.bids.filter((bid) => {
    return bid._id != req.body.bidId;
  });
  for (var i = 0; i < bidIds.length; i++) {
    // if (req.body.members[i] === null) continue;
    await Post.updateOne(
      { "bids._id": mongoose.Types.ObjectId(bidIds[i]._id) },
      {
        $set: {
          "bids.$.bidStatus": "Rejected",
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
  try {
    const updatedPost = await Post.findOne({
      _id: req.body.postId,
    });
    console.log(updatedPost);
    res.status(201).send(updatedPost);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

//  Rejecting A Bid
router.post("/rejectBid", async (req, res) => {
  const { error } = rejectBidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  await Post.updateOne(
    { "bids._id": mongoose.Types.ObjectId(req.body.bidId) },
    {
      $set: {
        "bids.$.bidStatus": "Rejected",
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
      _id: req.body.postId,
    });
    console.log(updatedPost);
    res.status(201).send(updatedPost);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

//  Get Post Bids
router.post("/getPostBids", async (req, res) => {
  // console.log(req.body)
  const { error } = bidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const post = await Post.findOne({
    _id: req.body.postId,
  });
  if (!post) res.status(400).send("Post does not exist");
  const bids = post.bids;
  res.status(201).send(bids);
});

// Get Accepted Bids
router.post("/getAcceptedBids", async (req, res) => {
  // console.log(req.body)
  const { error } = bidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const post = await Post.findOne({
    _id: req.body.postId,
  });
  if (!post) res.status(400).send("Post does not exist");
  const bids = post.bids;
  const acceptedBids = bids.filter((bid) => {
    return bid.bidStatus == "Accepted";
  });
  res.status(201).send(acceptedBids);
});

// Get Rejected Bids
router.post("/getRejectedBids", async (req, res) => {
  // console.log(req.body)
  const { error } = bidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const post = await Post.findOne({
    _id: req.body.postId,
  });
  if (!post) res.status(400).send("Post does not exist");
  const bids = post.bids;
  const rejectedBids = bids.filter((bid) => {
    return bid.bidStatus == "Rejected";
  });
  res.status(201).send(rejectedBids);
});

// Get User Bid
router.post("/getUserBid", async (req, res) => {
  // console.log(req.body)
  const { error } = userBidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");
  const post = await Post.findOne({
    _id: req.body.postId,
  });
  if (!post) res.status(400).send("Post does not exist");
  const bids = post.bids;
  const bid = bids.filter((bid) => {
    return bid._id == req.body.bidId;
  });
  res.status(201).send(bid);
});

// Withdraw User Bid
router.post("/withdrawUserBid", async (req, res) => {
  // console.log(req.body)
  const { error } = userBidValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    _id: req.body.userId,
  });
  if (!user) res.status(400).send("User does not exist");
  const post = await Post.findOne({
    _id: req.body.postId,
  });
  if (!post) res.status(400).send("Post does not exist");
  await Post.updateOne(
    { _id: req.body.postId },
    {
      $pull: { bids: { _id: mongoose.Types.ObjectId(req.body.bidId) } },
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
      _id: req.body.postId,
    });
    const bids = updatedPost.bids;
    res.status(201).send(bids);
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

// Get All Posts => All Posts

router.get("/getAllPosts", async (req, res) => {
  const allPosts = await Post.find();
  res.status(201).send(allPosts);
});

router.post("/getUserPosts", async (req, res) => {
  // console.log(req.body)
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("User does not exist");
  const userPosts = user.posts.map(({ id }) => id);
  // console.log(userPosts);
  res.status(201).send(userPosts);
});

module.exports = router;
