import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {createProfile, updateProfile} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/create",protectRoute, createProfile);
router.post("/update", protectRoute, updateProfile);

export default router;