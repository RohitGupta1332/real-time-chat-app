import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProfile, updateProfile } from "../controllers/profile.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post("/create",protectRoute, createProfile);
router.post("/update", protectRoute, updateProfile);

export default router;