const User = require("../models/userModel");
const PendingUser = require("../models/pendingUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Helper: generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Minimum time between OTP sends in ms
const OTP_RESEND_INTERVAL = 30 * 1000; // 30 seconds

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Remove any old pending registrations
    await PendingUser.deleteOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = generateOtp();
    console.log("Generated OTP:", otpCode); // For testing purposes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save as PendingUser
    await PendingUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp: { code: otpCode, expiresAt },
    });

    try {
      await sendEmail(email, `Your OTP code is ${otpCode}`);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent to email. Please verify." });
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

    const otpCode = generateOtp();
    console.log("Login OTP:", otpCode); // For testing purposes
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    user.otp = { code: otpCode, expiresAt, lastSentAt: now };
    await user.save();

    try {
      await sendEmail(email, `Your OTP code is ${otpCode}`);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, context } = req.body; 
    // context = "signup" or "login"
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    if (context === "signup") {
      // Check in PendingUser
      const pendingUser = await PendingUser.findOne({ email });
      if (!pendingUser) {
        return res.status(400).json({ message: "No pending registration found" });
      }

      if (pendingUser.otp.code !== otp || pendingUser.otp.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Move from PendingUser -> User
      const newUser = await User.create({
        fullName: { firstName: pendingUser.firstName, lastName: pendingUser.lastName },
        email: pendingUser.email,
        password: pendingUser.password, // already hashed
        provider: "email",
        isVerified: true,
      });

      await PendingUser.deleteOne({ email });

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
      // Check in User
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Clear OTP after successful login
      user.otp = undefined;
      await user.save();

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

    return res.status(400).json({ message: "Invalid context. Must be signup or login" });
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = otpCode;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    try {
      await sendEmail(email, `Your password reset OTP is ${otpCode}`);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.status(200).json({ message: "Password reset OTP sent to email" });
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

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
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

    // Rate limiting: check last OTP send
    const now = new Date();
    if (user.otp?.lastSentAt && now - user.otp.lastSentAt < OTP_RESEND_INTERVAL) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }

    const otpCode = generateOtp();
    console.log("Resent OTP:", otpCode); // For testing purposes
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    user.otp = { code: otpCode, expiresAt, lastSentAt: now };
    await user.save();

    try {
      await sendEmail(email, `Your new OTP code is ${otpCode}`);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  resendOtp,
};
