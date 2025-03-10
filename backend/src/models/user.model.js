import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  isProfileCreated: {
    type: Boolean,
    default: false
  },
  verficationTokenExpiresAt: Date,
});

export const User = mongoose.model("user", userSchema);
