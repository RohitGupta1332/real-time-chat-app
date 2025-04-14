import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProfile, updateProfile, getProfile } from "../controllers/profile.controller.js";


const router = express.Router();

router.post("/create", protectRoute, createProfile);
router.post("/update", protectRoute, updateProfile);
router.get("/view", protectRoute, getProfile);

export default router;