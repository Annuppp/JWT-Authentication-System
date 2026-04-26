import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    mongoose.connect(config.MONGO_URI);
    console.log("Database connected");
};

export default connectDB;
