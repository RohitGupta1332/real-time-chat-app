import express from "express";
import {signup, login, verifyEmail, checkAuth} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyEmail)
router.post("/login", login);
router.get("/check", protectRoute, checkAuth)

export default router;