const router = require("express").Router();
const {
    newFirmValidation,
  emailValidation,
} = require("../middleware/validation");
const User = require("../models/User");
const Firm = require("../models/Firm");
var mongoose = require("mongoose");
 
// Creating a new firm
router.post("/createFirm", async (req, res) => {
    console.log(req.body)
  const { error } = newFirmValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) res.send("User does not exist, invalid email");
  const name = `${user.firstname} ${user.lastname}`
  // console.log(req.body);
  const newFirm = new Firm({
    title: req.body.title,
    description: req.body.description,
    members:req.body.members,
    creator:name,
    creatorImage:user.image,
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
          }
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
    res.status(201).send(savedFirm);
  } catch (err) {
    res.status(400).send("An Error Occured", err);
  }
});


// Updating a Firm
 
// router.post("/addMember", async (req, res) => {
//     const { error } = updateFirmValidation(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     console.log(req.body);
   
//     await Firm.updateOne(
//       { _id: req.body.id },
//       {
//         {
//             $addToSet: {
//                 members: {
//                 id: savedFirm._id,
//                 date: savedFirm.date,
//               }
//                 // savedPost
    
//             },
//           },
//       },
//       function (err, docs) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Updated Docs : ", docs);
//         }
//       }
//     );
//     try {
//       const updatedPost = await Post.findOne({
//         _id: req.body.id,
//       });
//       console.log(updatedPost);
//       res.status(201).send(updatedPost);
//     } catch (err) {
//       res.status(400).send("An Error Occured", err);
//     }
//   });
 
module.exports = router;