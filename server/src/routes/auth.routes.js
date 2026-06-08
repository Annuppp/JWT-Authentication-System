import { Router } from "express";
import * as authController from "../controller/auth.controller.js";

const authRouter = Router();

// register user
authRouter.post("/register", authController.userRegister);

// identifying user
authRouter.get("/get-me", authController.getMe);

// to generate new access token
authRouter.get("/refresh-token", authController.refreshToken);

// logout
authRouter.get("/logout", authController.logout);

export default authRouter;
