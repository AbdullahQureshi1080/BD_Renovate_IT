const router = require("express").Router();
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
  emailValidation,
  getSpecificCategoryProfessional,
} = require("../middleware/validation");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const passport = require("passport");

// Register Route
router.post("/register", async (req, res) => {
  // Validate data of user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  Check for if user already exists in database
  const emailExist = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (emailExist)
    return res.status(400).send({ error: "Email already exists" });

  // Hash the Password
  // String with complexity of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new User
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login  Route
router.post("/login", async (req, res) => {
  // Validate data of user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email exists
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) return res.status(400).send("Email does not exists");

  // Check if Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //  Create and assign a token
  const token = JWT.sign(
    {
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
      posts: user.posts,
      projects: user.projects,
      firms: user.firms,
    },

    process.env.TOKEN_SECRET
  );
  res.send(token);
});

router.post("/getAllUsers", async (req, res) => {
  // console.log(req.body)
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("Invalid request for get-all-users");
  const allUsers = await User.find();
  // console.log(allUsers);
  const userData = allUsers.map((user) => ({
    name: `${user.firstname} ${user.lastname}`,
    _id: user.id,
    email: user.email,
    about: user.about,
    location: user.location,
    jobtitle: user.jobtitle,
    jobcategory: user.jobcategory,
    image: user.image,
    posts: user.posts,
    // chats: user.chats,
    projects: user.projects,
    // firms: user.firms,
  }));

  // console.log(userData);
  res.status(201).send(userData);
});

router.post("/getSpecificCategoryProfessional", async (req, res) => {
  // console.log(req.body)
  const { error } = getSpecificCategoryProfessional(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("Invalid request for get-all-users");
  const allUsers = await User.find({ jobcategory: req.body.category });
  // console.log(allUsers);
  const userData = allUsers.map((user) => ({
    name: `${user.firstname} ${user.lastname}`,
    _id: user.id,
    email: user.email,
    about: user.about,
    location: user.location,
    jobtitle: user.jobtitle,
    jobcategory: user.jobcategory,
    image: user.image,
    posts: user.posts,
    projects: user.projects,
  }));

  // console.log(userData);
  res.status(201).send(userData);
});

module.exports = router;
