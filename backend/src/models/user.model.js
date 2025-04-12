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
  isProfileCreated: {
    type: Boolean,
    default: false
  },
});

export const User = mongoose.model("user", userSchema);
