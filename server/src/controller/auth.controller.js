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

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "1d",
            },
        );

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
