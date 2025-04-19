import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { AIMessage } from "../models/ai.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { Profile } from '../models/profile.model.js'

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        }).select("senderId receiverId");

        const userIds = new Set();

        messages.forEach(msg => {
            if (msg.senderId.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.receiverId.toString());
            }
        });

        const users = await Profile.find({ userId: { $in: Array.from(userIds) } });

        res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId; //loggedIn person
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json({ messages: messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message, media } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.userId; //loggedIn person

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: message,
            media
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId)
            io.to(receiverSocketId).emit("newMessage", newMessage);
        res.status(201).json({ message: "Message sent successfully", data: newMessage })
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
        const newAIMessage = await AIMessage.create({
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

export const isTyping = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId, typing } = req.body;
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId, typing });
        }
        res.status(200).json({ message: "Typing status sent" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}