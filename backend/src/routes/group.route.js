import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addGroupMembers, createGroup, fetchGroupMessage, fetchGroups, sendMessage } from "../controllers/group.controller.js";

const route = express.Router();
route.post("/create", protectRoute, createGroup);
route.post("/add-members", protectRoute, addGroupMembers);
route.post("/send", protectRoute, sendMessage);
route.get("/fetch-messages", protectRoute, fetchGroupMessage);
route.get("/fetch", protectRoute, fetchGroups);

export default route;