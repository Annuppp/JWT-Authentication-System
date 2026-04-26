import mongoose from "mongoose";
import config from "./config.js";

const connectDB = () => {
    mongoose.connect(config.MONGO_URI);
    console.log("Connected to Database");
};

export default connectDB;
