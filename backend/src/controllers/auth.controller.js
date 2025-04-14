import { sendVerificationMail } from "../middlewares/email.config.js";
import { User } from "../models/user.model.js";
import { PendingUser } from "../models/pendingUser.model.js"
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";


export const generateOtp = () => {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { token, expiresAt };
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const pendingUser = await PendingUser.findOne({ email });
    const { token: newVerificationCode, expiresAt } = generateOtp();

    pendingUser.verificationCode = newVerificationCode;
    pendingUser.expiresAt = expiresAt;
    await pendingUser.save();

    await sendVerificationMail(email, newVerificationCode);

    return res.status(200).json({ message: "Verification code resent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to resend code", error });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const PUser = await PendingUser.findOne({ email });
    if (PUser) {
      await PendingUser.deleteOne({ email });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const { token: verificationCode, expiresAt } = generateOtp();

    const pendingUser = await PendingUser.create({
      email,
      password: hash,
      verificationCode,
      expiresAt
    });

    await sendVerificationMail(email, verificationCode);

    return res.status(201).json({ message: "Verification code sent.", email: email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const pendingUser = await PendingUser.findOne({ email, verificationCode });
    if (!pendingUser) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (pendingUser.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    const newUser = await User.create({
      email,
      password: pendingUser.password,
    });

    await pendingUser.deleteOne();

    const token = generateToken(newUser);
    res.cookie("token", token, {
      credential: true,
    });

    res.status(201).json({ message: "New user added" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message || error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found. Please signup." });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      credential: true,
    });
    return res.status(200).json({ message: "Login successful", isProfileCreated: user.isProfileCreated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}