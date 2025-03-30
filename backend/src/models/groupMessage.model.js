import mongoose, {Schema} from "mongoose";

const groupMessageSchema = new Schema({
    group_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String
    }
}, {timestamps: true});

export const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);