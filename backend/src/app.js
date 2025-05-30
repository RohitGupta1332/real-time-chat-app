import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import databaseConn from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import profileRoute from "./routes/profile.route.js";
import groupRoute from "./routes/group.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { scheduleIndividualMessage, scheduleGroupMessage } from "./utils/cron.js";
import path from "path";

dotenv.config();

databaseConn();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

scheduleIndividualMessage();
scheduleGroupMessage();
const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute)
app.use("/api/messages", messageRoute);
app.use("/api/group", groupRoute);
app.use('/uploads',  express.static(path.join(__dirname, 'backend', 'public', 'uploads')));
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
