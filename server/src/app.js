import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookie from "cookie-parser";

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookie());

// routes
app.use("/api/auth", authRouter);

export default app;
