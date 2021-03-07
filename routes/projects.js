const router = require("express").Router();
const {
  newProjectValidation,
  updateProjectValidation,
  deleteProjectValidation,
  emailValidation,
  commentValidation
} = require("../middleware/validation");
const User = require("../models/User");
const Project = require("../models/Project");
var mongoose = require("mongoose");
 
// Creating a new project


router.post("/newProject", async (req, res) => {
  const { error } = newProjectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) res.send("User does not exist, invalid email");
  const name = `${user.firstname} ${user.lastname}`
  console.log(req.body);
  const newProject = new Project({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    data:req.body.data,
    creator:name,
    creatorImage:user.image,
  });
 
  try {
    const savedProject= await newProject.save();
    await User.updateOne(
      { email: req.body.email },
      {
        $addToSet: {
          projects: {
            id: savedProject._id,
            date: savedProject.date,
          }
            // savedProject

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
    res.status(201).send(savedProject);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }

});
 
// Updating a project
 
router.post("/updateProject", async (req, res) => {
  const { error } = updateProjectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
 
  await Project.updateOne(
    { _id: req.body.id },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        data:req.body.data,
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
    const updatedProject = await Project.findOne({
      _id: req.body.id,
    });
    console.log(updatedProject);
    res.status(201).send(updatedProject);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});
 
// Deleteing a project
 
router.post("/deleteProject", async (req, res) => {
  const { error } = deleteProjectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    await Project.deleteOne({ _id: req.body.id }, function (err, docs) {
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
        // $pull: { projects:  {_id:mongoose.Types.ObjectId(req.body.id)}} ,
        $pull: { projects: { id: mongoose.Types.ObjectId(req.body.id) } },
      },
 
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
          res.status(200).send("Removed project Id from User projects");
        }
      }
    );
  } else {
    res.send("User does not exist");
  }
});
 
// Get All projects => All projects

router.get('/getAllProjects',async(req,res)=>{
  const allProjects = await Project.find();
  res.status(201).send(allProjects);
})

// Get All User Projects
router.post("/getUserProjects", async (req,res)=>{
  // console.log(req.body)
  const {error} = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("User does not exist");
  const userProjects = user.projects;
  // console.log(userprojects);
  res.status(201).send(userProjects);
})

router.post("/commentOnProject", async(req,res)=>{
  const {error} = commentValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const user = await User.findById({_id:req.body.userId});
  if (!user) res.status(400).send("User does not exist");
  // const findProject = await Project.find({_id:req.body.projectId});
  await Project.updateOne(
    {_id:req.body.projectId},
    {
      $addToSet: {
        comments: {
          commentorId: user._id,
          commentor: `${user.firstname}${user.lastname}`,
          commentorImage: user.image,
          comment:req.body.value,
          date: Date.now(),
        }
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
    const updatedProject = await Project.findOne({
      _id: req.body.projectId,
    });
    // console.log(updatedProject.comments);
    const comments = updatedProject.comments;
    res.status(201).send(comments);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
})

module.exports = router;
 

 

