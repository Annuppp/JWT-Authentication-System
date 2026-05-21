import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";

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

        // creating refreshToken

        const refreshToken = jwt.sign(
            {
                id: newUser._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        // hashing the refresh token
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        // creating session
        const session = await sessionModel.create({
            user: newUser._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        // creating access token
        const accessToken = jwt.sign(
            {
                id: newUser._id,
                sessionId: session._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        // storing refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "New user has been created",
            newUser: {
                email: newUser.email,
                username: newUser.username,
            },
            accessToken,
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
            return res.status(404).json({
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

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found",
            });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        const accessToken = jwt.sign(
            {
                id: decoded.id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        // for extra security, we generate new refresh token when refreshing the access token

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            config.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken,
        });
    } catch (err) {
        res.status(401).json({
            message: "Error refreshing the accessToken",
        });
    }
};
