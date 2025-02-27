import { sendVerificationMail } from "../middlewares/email.config.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

const unverifiedUsers = new Map(); //storing users whose email is not verified

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours

    // Temporarily store user data before verification
    unverifiedUsers.set(email.toLowerCase(), {
      hash,
      verificationToken,
      expiresAt,
    });

    await sendVerificationMail(email, verificationToken);

    return res.status(201).json({ message: "Verification code sent." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    let email = null;

    //fetching the userData from unverified map using the otp(code)
    for (let [userEmail, userData] of unverifiedUsers) {
      if (userData.verificationToken === code) {
        email = userEmail; 
        break;
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    const userData = unverifiedUsers.get(email);

    if (userData.expiresAt < new Date()) {
      unverifiedUsers.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    const newUser = await User.create({
      email,
      password: userData.hash,
      isVerified: true,
      verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    const token = generateToken(newUser);
    res.cookie("token", token, {
      credential: true,
    });

    await newUser.save();
    res.json({
      _id: newUser._id,
      email: newUser.email,
    });

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
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      credential: true,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
}