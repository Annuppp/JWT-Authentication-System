import Router from "express";
import * as authController from "../controller/auth.controller.js";

const authRouter = Router();

// register user
authRouter.post("/register", authController.userRegister);

export default authRouter;
