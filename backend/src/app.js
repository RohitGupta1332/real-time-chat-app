import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import databaseConn from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import profileRoute from "./routes/profile.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

databaseConn();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute)
app.use("/api/messages", messageRoute);
app.use('/uploads', express.static('public/uploads'));

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})