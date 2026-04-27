import { Router } from "express";
import * as authController from "../controller/auth.controller.js";

const authRoute = Router();

// 1. Register User
authRoute.post("/registerUser", authController.registerUser);

export default authRoute;
