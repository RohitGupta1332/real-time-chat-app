import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { addGroupMembers, createGroup, deleteGroup, fetchGroupMembers, fetchGroupMessages, fetchGroups, removeGroupMember, sendMessage } from "../controllers/group.controller.js";

const route = express.Router();
route.post("/create", protectRoute, upload.single("group_icon"), createGroup);
route.post("/add-members", protectRoute, addGroupMembers);
route.post("/send", protectRoute, upload.single("media"), sendMessage);
route.get("/get-groups", protectRoute, fetchGroups);
route.get("/get-members", protectRoute, fetchGroupMembers);
route.get("/messages/:group_id", protectRoute, fetchGroupMessages);
route.delete("/remove", protectRoute, removeGroupMember);
route.delete("/delete/:group_id", protectRoute, deleteGroup);

export default route;