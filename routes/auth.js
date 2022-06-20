const express = require("express");
const {
  register,
  login,
  getMe,
  google,
  google_profile,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.get("/register/google", google);
router.get("/google/profile", google_profile);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
