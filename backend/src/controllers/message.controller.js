import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { AIMessage } from "../models/ai.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

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
        const { id: receiverId } = req.params;
        const senderId = req.user._id; //loggedIn person
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });
        res.status(200).json({ messages: messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id; //loggedIn person

        let imageUrl;
        if (image) {
            //add file sharing using multer (import upload from utils)
        }

        const newMessage = Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        io.to(receiverSocketId).emit("newMessage", newMessage);

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error })
    }
}

export const messageAI = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const { prompt } = req.body;

        const result = await model.generateContent(prompt);
        const newAIMessage = AIMessage.create({
            userId: req.user.userId,
            prompt,
            response: result.response.text()
        });

        res.status(200).json({ data: result.response.text() });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }

}

// export const messageAI = async (req, res) => {
//     const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

//     const contents =
//         "name some animal that has wings";

//     // Set responseModalities to include "Image" so the model can generate  an image
//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash-exp-image-generation",
//         contents: contents,
//         config: {
//             responseModalities: ["Text", "Image"],
//         },
//     });
//     for (const part of response.candidates[0].content.parts) {
//         // Based on the part type, either show the text or save the image
//         if (part.text) {
//             console.log(part.text);
//         } else if (part.inlineData) {
//             const imageData = part.inlineData.data;
//             const buffer = Buffer.from(imageData, "base64");
//             fs.writeFileSync("gemini-native-image.png", buffer);
//             console.log("Image saved as gemini-native-image.png");
//         }
//     }
// }

export const getMessagesWithAi = async (req, res) => {
    try {
        const userId = req.user.userId;
        const messages = await AIMessage.find({ userId })
        res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}