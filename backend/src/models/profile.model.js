import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
    },
    instagramUrl: {
        type: String
    },
    facebookUrl: {
        type: String
    },
    youtubeUrl: {
        type: String
    },
    twitterUrl: {
        type: String
    }
});

export const Profile = mongoose.model("profile", profileSchema);