import userModel from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

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

        const refreshToken = jwt.sign(
            {
                id: newUser._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const accessToken = jwt.sign(
            {
                id: newUser._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        res.status(201).json({
            message: "User successfully created",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            accessToken,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error registering the user",
            error: err.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(404).json({
                message: "token was not found",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findOne({
            _id: decoded.id,
        });

        if (!user) {
            return res.status(404).json({
                message: "No user was found",
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (err) {
        res.status(400).json({
            message: "Error verifying the user",
            error: err.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(404).json({
                message: "Refresh token not found",
            });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        const accessToken = jwt.sign(
            {
                id: decoded.id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        const newRefreshToken = jwt.sign(
            {
                id: decoded.id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "Successfully created new token",
            user,
            accessToken,
        });
    } catch (err) {
        return res.status(400).json({
            message: "Error generating the tokens",
            error: err.message,
        });
    }
};
