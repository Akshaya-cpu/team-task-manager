const express = require("express");
const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", async (req, res) => {
  try {
    const User = require("../models/User");

    const users = await User.find().select("name email role");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;