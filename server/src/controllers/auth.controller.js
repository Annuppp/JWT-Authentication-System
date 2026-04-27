import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "User is already Registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            return res.status(500).json({
                message: "Error creating a new user",
            });
        }

        return res.status(201).json({
            message: "User sucessfully registered",
            newUser: {
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Error registering the user",
            error: err.message,
        });
    }
};
