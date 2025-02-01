import express from "express";
import {signup, login, verifyEmail} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyEmail)
router.post("/login", login);

export default router;