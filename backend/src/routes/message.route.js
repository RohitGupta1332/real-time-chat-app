import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { deleteMessage, getUsersForSidebar } from "../controllers/message.controller.js"
import { getMessages } from "../controllers/message.controller.js"
import { sendMessage } from "../controllers/message.controller.js"
import { messageAI } from "../controllers/message.controller.js";
import { getMessagesWithAi } from "../controllers/message.controller.js";
import { isTyping } from "../controllers/message.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("media"), sendMessage);
router.post("/ai", protectRoute, messageAI);
router.get("/ai/chats", protectRoute, getMessagesWithAi)
router.post("/typing", protectRoute, isTyping);
router.delete("/delete/:message_id", protectRoute, deleteMessage);

export default router;