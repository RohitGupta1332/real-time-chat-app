import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {createProfile} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/create",protectRoute, createProfile);

export default router;