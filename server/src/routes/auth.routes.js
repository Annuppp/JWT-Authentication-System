import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// 1. registering User
authRouter.post("/register", authController.registerUser);

// 2. getme
authRouter.get("/get-me", authController.getMe);

// 3. rotate tokens
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
