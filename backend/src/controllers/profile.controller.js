import { Profile } from "../models/profile.model.js";
import cloudinary from "cloudinary";
import { User } from "../models/user.model.js";

export const createProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { name, username, gender, image, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;

        const existingUser = await Profile.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        let imageUrl = "";
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            }
        }

        const newProfile = await Profile.create({
            userId,
            name,
            username,
            gender,
            image: imageUrl,
            bio,
            instagramUrl,
            youtubeUrl,
            facebookUrl,
            twitterUrl
        });

        const userUpdateResult = await User.findOne(
            { _id: userId },
            { $set: { isProfileCreated: true } },
            { new: true }
        );

        if (!userUpdateResult) {
            return res.status(404).json({ message: "User not found, profile created but status not updated" });
        }

        res.status(201).json({ message: "Profile created successfully", profile: newProfile });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const updateProfile = async (req, res) => {
    try {
        let { name, username, gender, image, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;
        const existingUser = await Profile.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let imageUrl = existingUser.image;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        await Profile.updateOne({ username },
            {
                $set: {
                    name,
                    gender,
                    image: imageUrl,
                    bio,
                    instagramUrl,
                    youtubeUrl,
                    facebookUrl,
                    twitterUrl
                }
            }
        );
        res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}