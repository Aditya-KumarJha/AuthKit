const express = require("express");
const router = express.Router();
const { 
  getUserProfile,
  generateLinkChallenge,
  linkWalletAddress
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/me", protect, getUserProfile);
router.post("/me/generate-link-challenge", protect, generateLinkChallenge);
router.post("/me/link-wallet", protect, linkWalletAddress);

module.exports = router;
