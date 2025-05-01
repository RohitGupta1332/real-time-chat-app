import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    media: {
        type: String
    },
    scheduledAt: {
        type: Date
    },
    isSent: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }
)

export const Message = mongoose.model('Message', messageSchema);