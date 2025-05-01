import cron from "node-cron";
import { Message } from "../models/message.model.js";
import { GroupMessage } from "../models/groupMessage.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const scheduleIndividualMessage = () => {
    try {
        cron.schedule('* * * * *', async () => {
            const now = Date.now();
            const oneMinuteAgo = now - 60000;
            const messages = await Message.find({
                scheduledAt: { $gte: new Date(oneMinuteAgo), $lte: new Date(now) },
                isSent: false
            });
            for (const msg of messages) {
                const receiverSocketId = getReceiverSocketId(msg.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", msg);
                }
                msg.isSent = true;
                await msg.save();
            }

        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const scheduleGroupMessage = () => {
    try {
        cron.schedule('* * * * *', async () => {
            const now = Date.now();
            const oneMinuteAgo = now - 60000;
            const messages = await GroupMessage.find({
                scheduledAt: { $gte: new Date(oneMinuteAgo), $lte: new Date(now) },
                isSent: false
            });

            for (const msg of messages) {
                io.to(String(msg.group_id)).emit("groupMessage", msg);
                msg.isSent = true;
                await msg.save();
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}