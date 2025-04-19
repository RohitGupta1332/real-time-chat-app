import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js"
import { getMessages } from "../controllers/message.controller.js"
import { sendMessage } from "../controllers/message.controller.js"
import { messageAI } from "../controllers/message.controller.js";
import { getMessagesWithAi } from "../controllers/message.controller.js";
import { isTyping } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/ai", protectRoute, messageAI);
router.get("/ai/chats", protectRoute, getMessagesWithAi)
router.post("/typing", protectRoute, isTyping);

export default router;