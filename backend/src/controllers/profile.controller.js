import { Profile } from "../models/profile.model.js";
import cloudinary from "cloudinary";

export const createProfile = async (req, res) => {
    try {
        let { name, username, gender, image, bio, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.body;
        const existingUser = await Profile.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "Username already exists"});
        }
        let imageUrl;
        if (image) {
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newProfile = Profile.create({
            name,
            username,
            gender,
            image: imageUrl || '',
            bio,
            instagramUrl,
            youtubeUrl,
            facebookUrl,
            twitterUrl
        });

        res.status(201).json({ message: "Profile created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}