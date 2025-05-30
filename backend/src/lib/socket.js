import express from "express";
import http from "http";
import { Server } from "socket.io";
import { GroupMember } from "../models/groupMember.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});


const userSocketMap = {}; //storing online users

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", async (socket) => {
    console.log("A new user connected ", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;

        const memberships = await GroupMember.find({ user_id: userId }).select("group_id");
        memberships.forEach(member => {
            socket.join(member.group_id.toString()); 
        });
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("A user disconnected ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export { io, server, app };