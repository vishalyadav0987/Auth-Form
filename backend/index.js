const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path')
const connectDB = require("./connectDB/connect");
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);



if (process.env.NODE_ENV === "production") {
    // app.use(express.static(path.join(__dirname,"frontend/build")))

    const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(frontendPath));


    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"))
    })
}

app.use("/test", (req, res) => {
    res.send("This route is used for testing purposes. Yeah, it's working!");
});

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Something went wrong in connecting to the server:", error.message);
    }
}

start();
