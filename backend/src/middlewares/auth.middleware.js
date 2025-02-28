import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorised token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Error in token verification ", error: error })
    }
}