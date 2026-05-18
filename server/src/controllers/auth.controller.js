import userModel from "../models/user.models.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Every field is required",
            });
        }

        const alreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (alreadyRegistered) {
            return res.status(409).json({
                message: "User is already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            return res.status(404).json({
                message: "Error creating the user",
            });
        }

        res.status(201).json({
            message: "User successfully created",
            user: {
                id: newUser._id,
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
