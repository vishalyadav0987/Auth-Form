const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.json({
                success: false,
                message: "Unauthorized - no token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECERET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.log("Error in protectedRoute ", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = protectedRoute;