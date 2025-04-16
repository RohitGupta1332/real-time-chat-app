import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

export const createProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { image, name, username, gender, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;

        const newProfile = await Profile.create({
            userId,
            name,
            username,
            gender,
            image,
            bio,
            instagramUrl,
            youtubeUrl,
            facebookUrl,
            twitterUrl
        });

        const userUpdateResult = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isProfileCreated: true } },
            { new: true }
        );

        if (!userUpdateResult) {
            return res.status(404).json({ message: "User not found, profile created but status not updated" });
        }

        res.status(201).json({ message: "Profile created successfully", profile: newProfile });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { image, name, username, gender, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;

        const existingProfile = await Profile.findOne({ username });
        if (!existingProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { username },
            {
                $set: {
                    name,
                    gender,
                    image,
                    bio,
                    instagramUrl,
                    youtubeUrl,
                    facebookUrl,
                    twitterUrl
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.query.userId;
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ profile: profile });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const searchProfile = async (req, res) => {
    try {
        const searchProfile = req.params.search;
        const currentUserId = req.user?.userId;

        if (!searchProfile) {
            return res.status(400).json({ message: "Search query is missing" });
        }

        const profiles = await Profile.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: searchProfile, $options: 'i' } },
                        { username: { $regex: searchProfile, $options: 'i' } }
                    ]
                },
                { userId: { $ne: currentUserId } }
            ]
        });

        if (profiles.length === 0) {
            return res.status(400).json({ message: "No profiles found" });
        }

        res.status(200).json({ result: profiles });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

