const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const normalize = require('normalize-url');

// @route               POST api/profile/me
// @desc                Get current users profile
// @access              Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for user",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route               POST api/profile
// @desc                Create or Update Profile
// @access              Private

router.post(
  "/",
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get fields req
    const {
      company,
      website,
      location,
      bio,status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest 
      ...rest
    } = req.body;

    // // create profile

    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map((skill) => ' ' + skill.trim())
    }

    console.log(profileFields.skills)
    // try {
    //     // Using upsert option (creates new doc if no match is found):
    //     let profile = await Profile.findOneAndUpdate(
    //       { user: req.user.id },
    //       { $set: profileFields },
    //       { new: true, upsert: true, setDefaultsOnInsert: true }
    //     );
    //     await profile.save();
    //     return res.json(profile);

    //   } catch (err) {
    //     console.error(err.message);
    //     return res.status(500).send('Server Error');
    //   }
  }
);

// @route               GET api/profile
// @desc                Get all profile
// @access              public

router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
module.exports = router;
