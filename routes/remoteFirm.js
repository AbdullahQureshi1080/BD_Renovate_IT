const router = require("express").Router();
const {
  newFirmValidation,
  emailValidation,
  noteValidation,
  getNoteValidation,
  deleteNoteValidation,
  deleteFirmValidation,
  updateNoteValidation,
  updateFirmValidation,
  addMemberFirmValidation,
  removeMemberFirmValidation,
} = require("../middleware/validation");
const User = require("../models/User");
const Firm = require("../models/Firm");
var mongoose = require("mongoose");

// Creating a new firm
router.post("/createFirm", async (req, res) => {
  console.log(req.body);
  const { error } = newFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) res.send("User does not exist, invalid email");
  const name = `${user.firstname} ${user.lastname}`;
  // console.log(req.body);
  const newFirm = new Firm({
    title: req.body.title,
    description: req.body.description,
    members: req.body.members,
    creatorId: user._id,
    creator: name,
    creatorImage: user.image,
  });

  try {
    const savedFirm = await newFirm.save();
    await User.updateOne(
      { email: req.body.email },
      {
        $addToSet: {
          firms: {
            id: savedFirm._id,
            date: savedFirm.date,
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
    for (var i = 0; i < req.body.members.length; i++) {
      // if(req.body.members[i] === null) continue;
      await User.updateOne(
        { email: req.body.members[i].email },
        {
          $addToSet: {
            firms: {
              id: savedFirm._id,
              date: savedFirm.date,
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
    }
    res.status(201).send(savedFirm);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

router.get("/getAllFirms", async (req, res) => {
  const allFirms = await Firm.find();
  res.status(201).send(allFirms);
});

// User Firms

router.post("/getUserFirms", async (req, res) => {
  // console.log(req.body)
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!user) res.status(400).send("User does not exist");
  const firms = user.firms.map(({ id }) => id);
  const allFirms = await Firm.find();
  const userFirms = allFirms.filter(({ _id }) => firms.includes(_id));
  res.status(201).send(userFirms);
});

router.post("/createNote", async (req, res) => {
  const { error } = noteValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(400).send("User does not exist");
  // const findProject = await Project.find({_id:req.body.projectId});
  await Firm.updateOne(
    { _id: req.body.firmId },
    {
      $addToSet: {
        notes: {
          id: mongoose.Types.ObjectId(),
          noterId: user._id,
          noter: `${user.firstname} ${user.lastname}`,
          noterImage: user.image,
          note: req.body.note,
          images: req.body.images,
          documents: req.body.documents,
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
    const updatedFirm = await Firm.findOne({
      _id: req.body.firmId,
    });
    // console.log(updatedProject.comments);
    const notes = updatedFirm.notes;
    res.status(201).send(notes);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

router.post("/getNotes", async (req, res) => {
  // console.log(req.body);
  const { error } = getNoteValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const user = await User.findById({_id:req.body.userId});
  // if (!user) res.status(400).send("User does not exist");
  try {
    const firm = await Firm.findOne({
      _id: req.body.firmId,
    });
    const notes = firm.notes;
    // console.log(comments);
    res.status(201).send(notes);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

router.post("/deleteNote", async (req, res) => {
  const { error } = deleteNoteValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    console.log(req.body);
    await Firm.updateOne(
      { _id: req.body.firmId },
      {
        $pull: { notes: { id: mongoose.Types.ObjectId(req.body.noteId) } },
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
      const updatedFirm = await Firm.findOne({
        _id: req.body.firmId,
      });
      // console.log(updatedProject.comments);
      const notes = updatedFirm.notes;
      res.status(201).send(notes);
    } catch (err) {
      res.status(400).send("An Error Occured", err);
    }
  } else {
    res.send("User does not exist");
  }
});

router.post("/deleteFirm", async (req, res) => {
  const { error } = deleteFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    await Firm.deleteOne({ _id: req.body.firmId }, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(400).send("An Error Occured", err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    });
    await User.updateOne(
      { email: req.body.email.toLowerCase() },
      {
        $pull: { firms: { id: mongoose.Types.ObjectId(req.body.firmId) } },
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    for (var i = 0; i < req.body.members.length; i++) {
      // if(req.body.members[i] === null) continue;
      await User.updateOne(
        { email: req.body.members[i].email },
        {
          $pull: { firms: { id: mongoose.Types.ObjectId(req.body.firmId) } },
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
    res.status(200).send("Firm Deleted");
  } else {
    res.send("User does not exist");
  }
});

router.post("/updateNote", async (req, res) => {
  const { error } = updateNoteValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  await Firm.updateOne(
    { "notes.id": mongoose.Types.ObjectId(req.body.noteId) },
    {
      $set: {
        "notes.$.note": req.body.note,
        "notes.$.images": req.body.images,
        "notes.$.documents": req.body.documents,
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
    const firm = await Firm.findOne({
      _id: req.body.firmId,
    });
    // console.log(updatedNote);
    res.status(201).send(firm.notes);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

// Updating a Firm

router.post("/updateFirm", async (req, res) => {
  const { error } = updateFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);

  await Firm.updateOne(
    { _id: req.body.firmId },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
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
    const updatedFirm = await Firm.findOne({
      _id: req.body.firmId,
    });
    // console.log(updatedFirm);
    res.status(201).send(updatedFirm);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

// Add a new member

router.post("/addNewMember", async (req, res) => {
  const { error } = addMemberFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);

  const firm = await Firm.findOne({
    _id: mongoose.Types.ObjectId(req.body.firmId),
  });

  const newUser = await User.findOne({
    _id: mongoose.Types.ObjectId(req.body.memberId),
  });
  // const members = Firm.find({ _id: req.body.firmId });

  // const filteredMembers
  const newMember = {
    _id: newUser._id,
    name: `${newUser.firstname} ${newUser.lastname}`,
    email: newUser.email,
    image: newUser.image,
    jobcategory: newUser.jobcategory,
    jobtitle: newUser.jobtitle,
  };

  await Firm.updateOne(
    { _id: req.body.firmId },
    {
      $addToSet: {
        members: newMember,
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
    { _id: req.body.memberId },
    {
      $addToSet: {
        firms: {
          id: firm._id,
          date: firm.date,
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
    const updatedFirm = await Firm.findOne({
      _id: req.body.firmId,
    });
    // console.log(updatedFirm);
    res.status(201).send(updatedFirm);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

// remove a  member

router.post("/removeMember", async (req, res) => {
  const { error } = removeMemberFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);

  await Firm.updateOne(
    { _id: req.body.firmId },
    {
      $pull: { members: { _id: mongoose.Types.ObjectId(req.body.memberId) } },
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
    { _id: req.body.memberId },
    {
      $pull: { firms: { id: mongoose.Types.ObjectId(req.body.firmId) } },
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
    const updatedFirm = await Firm.findOne({
      _id: req.body.firmId,
    });
    const updatedUser = await User.findOne({
      _id: req.body.memberId,
    });
    // console.log(updatedFirm);
    res.status(201).send(updatedFirm.members);
    // res.status(201).send(updatedUser.firms);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});

module.exports = router;
