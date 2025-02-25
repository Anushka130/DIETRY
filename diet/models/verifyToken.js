const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(403).send({ message: "Access Denied. No token provided." });
    }

    jwt.verify(token, "diet", (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Invalid token" });
        }
        req.user = decoded; // Attach decoded email to request
        next();
    });
}

module.exports = verifyToken;
