import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
    group_name: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

export const Group = mongoose.model("Group", groupSchema);