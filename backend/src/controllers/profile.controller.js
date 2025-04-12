import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { upload } from "../utils/multer.js";


export const createProfile = async (req, res) => {
    try {
        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                upload.single("image")(req, res, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(req.file ? req.file.filename : "");
                    }
                });
            });
        };

        const imageUrl = await uploadImage();

        const userId = req.user.userId;
        const { name, username, gender, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;

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
        const { name, username, gender, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;

        const existingProfile = await Profile.findOne({ username });
        if (!existingProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let imageUrl = existingProfile.image; 
        await new Promise((resolve, reject) => {
            upload.single("image")(req, res, (err) => {
                if (err) {
                    reject(err);
                } else {
                    if (req.file) {
                        imageUrl = req.file.filename; // Update image if a new file is uploaded
                    }
                    resolve();
                }
            });
        });

        const updatedProfile = await Profile.findOneAndUpdate(
            { username },
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
            },
            { new: true }
        );

        return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
