import mongoose, {Schema} from "mongoose";

const aiMessageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const AIMessage = mongoose.model("AIMessage", aiMessageSchema);