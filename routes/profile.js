const router = require("express").Router();
const User = require("../models/User.js");
const { updateValidation, getValidation } = require("../middleware/validation");
const { upload } = require("../middleware/upload");
 

router.post ("/imageUpload",async(req,res)=>{
    const {imageSource, userId} = req.body;
    console.log(imageSource,userId);
    if((imageSource && userId)!=null || ""){
        const uploadResult = upload(imageSource,userId);
        console.log(uploadResult);
        res.status(200).send(uploadResult)
    }
    else{
        res.status(400).send("Image Source and userId not valid");
    }
})

router.post("/updateProfile", async (req, res) => {
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  await User.updateOne(
    { email: req.body.email },
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        location: req.body.location,
        about: req.body.about,
        jobtitle: req.body.jobtitle,
        image:req.body.image,
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
    console.log(updatedUser);
    res.status(201).send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});
 
router.post("/getProfile", async (req, res) => {
  const { error } = getValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("User does not exist");
 
  const sendData = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    about: user.about,
    location: user.location,
    jobtitle: user.jobtitle,
  };
  res.status(201).send(sendData);
});
 
module.exports = router;
