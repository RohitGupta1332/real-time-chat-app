import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
    return jwt.sign({email : user.email, userId: user._id}, process.env.JWT_KEY, {
            expiresIn: "7d"
        })
}