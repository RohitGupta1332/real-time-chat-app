import mongoose, {Schema} from "mongoose";

const groupMemberSchema = new Schema({
    group_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export const GroupMember = mongoose.model("GroupMember", groupMemberSchema);