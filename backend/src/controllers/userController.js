const { ethers } = require("ethers");
const crypto = require("crypto");
const challenges = require("../utils/challengeStore");

const getUserProfile = async (req, res) => {
  const user = req.user;
  if (user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      provider: user.provider,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const generateLinkChallenge = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ message: "A valid wallet address is required." });
    }

    const nonce = crypto.randomBytes(32).toString("hex");
    const message = `Please sign this message to link this wallet to your AuthKit account.\n\nNonce: ${nonce}`;
    
    const lowerCaseAddress = address.toLowerCase();
    challenges.set(lowerCaseAddress, message);

    setTimeout(() => {
        if (challenges.get(lowerCaseAddress) === message) {
            challenges.delete(lowerCaseAddress);
        }
    }, 5 * 60 * 1000); 

    res.json({ message });
  } catch (error) {
    console.error("Link Wallet Challenge Error:", error);
    res.status(500).json({ message: "Server error during challenge generation." });
  }
};

const linkWalletAddress = async (req, res) => {
    try {
        const { address, signature } = req.body;
        if (!address || !signature) {
            return res.status(400).json({ message: "Wallet address and signature are required." });
        }

        const lowerCaseAddress = address.toLowerCase();
        const originalMessage = challenges.get(lowerCaseAddress);

        if (!originalMessage) {
            return res.status(400).json({ message: "Challenge not found or expired. Please try again." });
        }
        
        challenges.delete(lowerCaseAddress); 

        const recoveredAddress = ethers.verifyMessage(originalMessage, signature);

        if (recoveredAddress.toLowerCase() !== lowerCaseAddress) {
            return res.status(401).json({ message: "Signature verification failed." });
        }

        const user = req.user;
        user.walletAddress = lowerCaseAddress;
        await user.save();

        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          provider: user.provider,
          walletAddress: user.walletAddress,
          createdAt: user.createdAt,
        });

    } catch (error) {
        console.error("Link Wallet Error:", error);
        res.status(500).json({ message: "Server error during wallet linking." });
    }
};


module.exports = {
  getUserProfile,
  generateLinkChallenge,
  linkWalletAddress,
};

