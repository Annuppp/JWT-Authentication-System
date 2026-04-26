import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

app.listen(3000, () => {
    console.log("Server has been connected to port 3000");
});
