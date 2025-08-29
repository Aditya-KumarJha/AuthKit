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
      required: false,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    discordId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },
    walletAddress: { type: String, unique: true, sparse: true },
    profilePic: {
      type: String,
      default: "",
    },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: ["email", "google", "github", "facebook", "web3", "discord", "linkedin"],
      default: "email",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next) {
  const hasSocialId = this.googleId || this.githubId || this.facebookId || this.walletAddress || this.discordId || this.linkedinId;

  if (!hasSocialId && !this.password) {
    this.invalidate('password', 'Path `password` is required.', null, 'required');
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
