const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require("./connectDB/connect");
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);

app.use("/test", (req, res) => {
    res.send("This route using for testing purpose. Yaah it's working");
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("Somethig went wrong in connecting to the server")
    }
}

start();