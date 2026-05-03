import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const userRegister = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "Username or email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            email,
            username,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            message: "New user has been created",
            newUser: {
                email: newUser.email,
                username: newUser.username,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error registering the user",
            error: err.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            res.status(404).json({
                message: "User could not be found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "User could not be fetched",
            error: err.message,
        });
    }
};
