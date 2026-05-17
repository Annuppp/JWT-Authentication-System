import mongoose, { connect } from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to the database");
    } catch (err) {
        console.log("Error connecting to the database", err.message);
        process.exit(1);
    }
};

export default connectDB;
