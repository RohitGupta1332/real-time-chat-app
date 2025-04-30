import mongoose, {Schema} from "mongoose";

const groupMessageSchema = new Schema({
    group_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
    },
    media: {
        type: String
    }
}, {timestamps: true});

export const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);