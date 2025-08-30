const User = require("../models/userModel");
const PendingUser = require("../models/pendingUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");
const { ethers } = require("ethers");
const crypto = require("crypto"); 

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const OTP_RESEND_INTERVAL = 30 * 1000;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existingUser, hashedPassword] = await Promise.all([
      User.findOne({ email }),
      bcrypt.hash(password, 10),
    ]);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await PendingUser.deleteOne({ email });

    const otpCode = generateOtp();
    console.log("Signup Generated OTP:", otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PendingUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp: { code: otpCode, expiresAt },
    });

    res.status(200).json({ message: "OTP generated. Please check your email." });

    sendEmail(email, `Your OTP code is ${otpCode}`).catch((err) =>
      console.error("Email sending failed:", err)
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.provider !== "email")
      return res.status(400).json({ message: `Use ${user.provider} to login` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const now = new Date();

    if (user.otp?.lastSentAt && now - user.otp.lastSentAt < OTP_RESEND_INTERVAL) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }

    const otpCode = generateOtp();
    console.log("Login Generated OTP:", otpCode);
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      { $set: { otp: { code: otpCode, expiresAt, lastSentAt: now } } }
    );

    res.status(200).json({
      message: "OTP sent to email",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        provider: user.provider,
        profilePic: user.profilePic,
        isVerified: user.isVerified,
      },
    });

    sendEmail(email, `Your OTP code is ${otpCode}`).catch((err) =>
      console.error("Email sending failed:", err)
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, context } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    if (context === "signup") {
      const pendingUser = await PendingUser.findOne({ email });
      if (!pendingUser) {
        return res.status(400).json({ message: "No pending registration found" });
      }

      if (pendingUser.otp.code !== otp || pendingUser.otp.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const createUserPromise = User.create({
        fullName: { firstName: pendingUser.firstName, lastName: pendingUser.lastName },
        email: pendingUser.email,
        password: pendingUser.password,
        provider: "email",
        isVerified: true,
      });
      const deletePendingPromise = PendingUser.deleteOne({ email });

      const [newUser] = await Promise.all([createUserPromise, deletePendingPromise]);

      const token = generateToken(newUser);

      return res.status(201).json({
        message: "Signup OTP verified successfully",
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          provider: newUser.provider,
          profilePic: newUser.profilePic,
          isVerified: newUser.isVerified,
        },
      });
    }

    if (context === "login") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await User.updateOne({ _id: user._id }, { $unset: { otp: "" } });

      const token = generateToken(user);

      return res.status(200).json({
        message: "Login OTP verified successfully",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          provider: user.provider,
          profilePic: user.profilePic,
          isVerified: user.isVerified,
        },
      });
    }

    if (context === "forgot") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (
        user.resetPasswordToken !== otp ||
        user.resetPasswordExpires < new Date()
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      return res.status(200).json({
        message: "Forgot password OTP verified successfully",
        resetAllowed: true,
      });
    }

    return res.status(400).json({ message: "Invalid context. Must be signup, login, or forgot" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otpCode = generateOtp();
    console.log("Password Reset OTP:", otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = otpCode;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    res.status(200).json({ message: "Password reset OTP sent to email" });

    sendEmail(email, `Your password reset OTP is ${otpCode}`).catch((err) =>
      console.error("Email sending failed:", err)
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      user.resetPasswordToken !== otp ||
      user.resetPasswordExpires < new Date()
    ) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const now = new Date();
    if (user.otp?.lastSentAt && now - user.otp.lastSentAt < OTP_RESEND_INTERVAL) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }

    const otpCode = generateOtp();
    console.log("Resend OTP Generated:", otpCode);
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      { $set: { otp: { code: otpCode, expiresAt, lastSentAt: now } } }
    );

    res.status(200).json({ message: "New OTP sent to email" });

    sendEmail(email, `Your new OTP code is ${otpCode}`).catch((err) =>
      console.error("Email sending failed:", err)
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateChallenge = (req, res) => {
    const nonce = crypto.randomBytes(32).toString("hex");
    const challenge = `Please sign this message to authenticate your wallet. Nonce: ${nonce}`;
    res.status(200).json({ challenge, nonce });
  };
  
const verifySignature = async (req, res) => {
    const { walletAddress, signature, challenge, mode } = req.body;
  
    if (!walletAddress || !signature || !challenge || !mode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
  
    try {
      const recoveredAddress = ethers.utils.verifyMessage(challenge, signature);
  
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({ success: false, message: "Invalid signature" });
      }
  
      let user = await User.findOne({ walletAddress: walletAddress });
  
      if (mode === "login") {
        if (!user) {
          return res.status(401).json({ success: false, message: "User not found." });
        }
      } else if (mode === "signup") {
        if (!user) {
          user = await User.create({
            walletAddress: walletAddress,
            email: "", 
            fullName: { firstName: "", lastName: "" }, 
            provider: "web3",
            isVerified: true,
          });
        }
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      res.status(200).json({ success: true, token, user });
    } catch (err) {
      console.error("MetaMask verification failed:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
module.exports = {
  register,
  login,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  resendOtp,
  generateChallenge,
  verifySignature,
};
