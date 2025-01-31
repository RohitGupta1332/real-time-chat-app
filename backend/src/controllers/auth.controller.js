import {User} from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hash
        })

        const token = generateToken(newUser);
        res.cookie("token", token, {
            credential: true
        });
        
        return res.status(201).json({message: "User created successfully"});

    } catch (error) {
        return res.status(500).json({message: "Internal server error", error: error})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = generateToken(user);
        res.cookie("token", token, {
            credential: true
        });

        return res.status(200).json({message: "Login successful"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error", error: error})
    }
}