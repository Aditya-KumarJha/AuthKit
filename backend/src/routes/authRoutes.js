const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  resendOtp
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

router.post("/resend-otp", resendOtp);

module.exports = router;
