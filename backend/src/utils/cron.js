import cron from "node-cron";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const scheduleMessage = () => {
    try {
        const time = new Date();
        cron.schedule('* * * * *', async () => {
            const messages = await Message.find({
                scheduledAt: { $lte: now },
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