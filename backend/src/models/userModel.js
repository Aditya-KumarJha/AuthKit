const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId && !this.githubId && !this.facebookId && !this.walletAddress && !this.discordId;;
      },
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    walletAddress: { type: String, unique: true, sparse: true },
    profilePic: {
      type: String,
      default: "",
    },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: ["email", "google", "github", "facebook", "web3"],
      default: "email",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
