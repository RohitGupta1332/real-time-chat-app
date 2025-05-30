import { Message } from "../models/message.model.js";
import { AIMessage } from "../models/ai.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { Profile } from '../models/profile.model.js'
import path from "path";
import { fileURLToPath } from "url";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        }).select("senderId receiverId createdAt");

        const userLastMessageMap = new Map();

        messages.forEach(msg => {
            const otherUserId = msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString();

            const existing = userLastMessageMap.get(otherUserId);
            if (!existing || new Date(existing.createdAt) < new Date(msg.createdAt)) {
                userLastMessageMap.set(otherUserId, { ...msg._doc });
            }
        });

        const sortedUserEntries = Array.from(userLastMessageMap.entries())
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

        const sortedUserIds = sortedUserEntries.map(([userId]) => userId);

        const profiles = await Profile.find({ userId: { $in: sortedUserIds } });

        const profileMap = new Map(profiles.map(profile => [profile.userId.toString(), profile]));
        const sortedProfiles = sortedUserIds.map(id => profileMap.get(id)).filter(Boolean);

        res.status(200).json(sortedProfiles);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId; //loggedIn person
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            isSent: true
        }).sort({ updatedAt: 1 });
        res.status(200).json({ messages: messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message, scheduleTime } = req.body;
        let scheduledAt = "";
        if (scheduleTime) {
            scheduledAt = new Date(scheduleTime);
        }

        const { id: receiverId } = req.params;
        const senderId = req.user.userId;
        let mediaUrl = req.file?.filename || "";

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: message,
            media: mediaUrl,
            scheduledAt
        });

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (!scheduleTime) {
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            newMessage.isSent = true;
            newMessage.save();
        }
        res.status(201).json({ message: "Message sent successfully", data: newMessage })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error })
    }
}

export const messageAI = async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
        const { prompt } = req.body;
        const userId = req.user.userId;

        const chat = ai.chats.create({
            model: "gemini-2.0-flash-exp-image-generation",
            config: {
                temperature: 0.05,
                responseModalities: ["Text", "Image"],
            },
        });

        const response = await chat.sendMessage({ message: prompt });
        const uploadDir = path.join(__dirname, "../../public/uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        let responseText = "";
        let mediaFilename = "";

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                responseText += part.text.trim();
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");

                mediaFilename = `gemini-image-${Date.now()}.png`;
                const filePath = path.join(uploadDir, mediaFilename);

                fs.writeFileSync(filePath, buffer);
            }
        }

        const saved = await AIMessage.create({
            userId,
            prompt,
            response: {
                text: responseText || undefined,
                media: mediaFilename || undefined
            }
        });

        res.status(200).json({
            message: "AI response saved successfully",
            response: saved.response
        });


    } catch (error) {
        console.error("Error in messageAI:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


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

export const deleteMessage = async (req, res) => {
    try {
        const { message_id } = req.params;
        const message = await Message.findByIdAndDelete({ _id: message_id });
        if (message) {
            return res.status(200).json({ message: "Message deleted successfully" });
        }
        res.status(400).json("Something went wrong");
    } catch (error) {
        res.status(500).json({ message: "Internal server errror", error: error.message || error });
    }
}