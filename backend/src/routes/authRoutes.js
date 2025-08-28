const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  register,
  login,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  resendOtp,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);

module.exports = router;
