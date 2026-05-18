import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "username is required"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "email is required"],
        },
        password: {
            type: String,
            unique: true,
            required: [true, "password is required"],
        },
    },
    { timestamps: true },
);

const userModel = new mongoose.model("User", userSchema);

export default userModel;
