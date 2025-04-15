import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProfile, updateProfile, getProfile, searchProfile } from "../controllers/profile.controller.js";


const router = express.Router();

router.post("/create", protectRoute, createProfile);
router.post("/update", protectRoute, updateProfile);
router.get("/view", protectRoute, getProfile);
router.get("/:search", protectRoute, searchProfile)

export default router;