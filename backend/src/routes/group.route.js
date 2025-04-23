import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { addGroupMembers, createGroup, deleteGroup, fetchGroupMessage, fetchGroups, sendMessage } from "../controllers/group.controller.js";

const route = express.Router();
route.post("/create", protectRoute, createGroup);
route.post("/add-members", protectRoute, addGroupMembers);
route.post("/send", protectRoute, upload.single("media"), sendMessage);
route.get("/get-messages", protectRoute, fetchGroupMessage);
route.get("/get-groups", protectRoute, fetchGroups);
route.get("/messages/:group_id", protectRoute, fetchGroupMessage);
route.delete("/delete/:group_id", protectRoute, deleteGroup);

export default route;