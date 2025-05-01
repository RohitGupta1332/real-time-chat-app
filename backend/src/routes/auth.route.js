import express from "express";
import { signup, login, verifyEmail, checkAuth, resendVerification, logout } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyEmail)
router.post("/login", login);
router.post("/resend", resendVerification);
router.get("/check", protectRoute, checkAuth)
router.post("/logout", protectRoute, logout)

export default router;