import mongoose, { Schema } from "mongoose";

const pendingUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);