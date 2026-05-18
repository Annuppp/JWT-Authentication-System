import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// 1. registering User
authRouter.post("/register", authController.registerUser);

export default authRouter;
