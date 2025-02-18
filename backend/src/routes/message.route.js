import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {getUsersForSidebar} from "../controllers/message.controller.js"
import {getMessages} from "../controllers/message.controller.js"
import {sendMessage} from "../controllers/message.controller.js"


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/id", getMessages);
router.post("/send/:id", sendMessage);

export default router;