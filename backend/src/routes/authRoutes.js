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

const FRONTEND_URL = process.env.VERCEL_CLIENT_URL || process.env.CLIENT_URL;

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

const socialAuthCallback = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) {
      console.error(`Authentication failed for ${strategy}.`);
      console.error("Error details:", err.stack);
      return res.redirect(`${FRONTEND_URL}/login?error=Authentication+failed+due+to+server+error`);
    }
    if (!user) {
      if (info && info.message) {
        return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(info.message)}`);
      }
      return res.redirect(`${FRONTEND_URL}/login?error=Authentication+failed`);
    }
    req.user = user;
    next();
  })(req, res, next);
};

const socialAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/login?error=Authentication+failed`);
  }
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
};

router.get(
  "/google",
  (req, res, next) => {
    const mode = req.query.mode || "login";
    passport.authenticate("google", { scope: ["profile", "email"], state: mode })(req, res, next);
  }
);
router.get("/google/callback", socialAuthCallback("google"), socialAuthSuccess);

router.get(
  "/github",
  (req, res, next) => {
    const mode = req.query.mode || "login";
    passport.authenticate("github", { scope: ["user:email"], state: mode })(req, res, next);
  }
);
router.get("/github/callback", socialAuthCallback("github"), socialAuthSuccess);

router.get(
  "/facebook",
  (req, res, next) => {
    const mode = req.query.mode || "login";
    passport.authenticate("facebook", { scope: ["email"], state: mode })(req, res, next);
  }
);
router.get("/facebook/callback", socialAuthCallback("facebook"), socialAuthSuccess);

router.get(
  "/discord",
  (req, res, next) => {
    const mode = req.query.mode || "login";
    passport.authenticate("discord", { scope: ["identify", "email"], state: mode })(req, res, next);
  }
);
router.get("/discord/callback", socialAuthCallback("discord"), socialAuthSuccess);

module.exports = router;
