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
  (req, res, next) => {
    const mode = req.query.mode || "login"; 
    passport.authenticate("google", { scope: ["profile", "email"], state: mode })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:3000/login?error=No+account+exists+with+this+Google+email" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);

router.get(
  "/github",
  (req, res, next) => {
    const mode = req.query.mode || "login"; 
    passport.authenticate("github", { scope: ["user:email"], state: mode })(req, res, next);
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect:
      "http://localhost:3000/login?error=No+account+exists+with+this+GitHub+email",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);

router.get(
  "/facebook",
  (req, res, next) => {
    const mode = req.query.mode || "login"; 
    passport.authenticate("facebook", { scope: ["email"], state: mode })(req, res, next);
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect:
      "http://localhost:3000/login?error=No+account+exists+with+this+Facebook+email",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);

module.exports = router;
