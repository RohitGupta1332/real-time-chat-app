import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "cloudinary";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const senderId = req.user._id; //loggedIn person
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
                ]
        });
        res.status(200).json({messages: messages});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message || error});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id; //loggedIn person

        let imageUrl;
        if(image){
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });


    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message || error})
    }
}