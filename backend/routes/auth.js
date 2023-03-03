const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET;

//route 1: creating user
router.post(
  "/createuser",
  // Validating user input
  [
    body("name", "Enter minimum 2 char").isLength({ min: 2 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter minimum 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // Check if user with email is already exists.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          errors: "User with this email is already exists.",
        });
      }

      // Creating hash for password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Inserting user into mongo db
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // const data = {
      //   user: {
      //     id: user.id,
      //   },
      // };

      // const authToken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      res.json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error.");
    }
  }
);

//route 2: login user
router.post(
  "/login",
  // Validating user input
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password can not be blank.").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "Please enter correct credentials." });
      }

      const passCompare = await bcrypt.compare(password, user.password);

      if (!passCompare) {
        return res
          .status(400)
          .json({ success: false, error: "Please enter correct credentials." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ success: true, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error.");
    }
  }
);

//route 3: fetch User
router.post("/fetchuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error.");
  }
});

//route 4 : change password
router.put(
  "/changepassword",
  fetchUser,
  [
    body("existing", "Password can not be blank.").exists(),
    body("new", "New Password is atleast 5 char.").isLength({ min: 5 }),
    body("confirm", "Confirm Password is atleast 5 char.").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.new !== req.body.confirm) {
        return res
          .status(400)
          .json({ success: false, error: "Password not match." });
      }

      const user = await User.findById(req.user.id).select(
        "name email password"
      );
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "User Not Found." });
      }

      const passCompare = await bcrypt.compare(
        req.body.existing,
        user.password
      );

      if (!passCompare) {
        return res.status(400).json({
          success: false,
          error: "Please enter correct existing password.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.new, salt);

      const nUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { password: secPass } },
        { new: true }
      );

      res.send({success : true , user: nUser});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
