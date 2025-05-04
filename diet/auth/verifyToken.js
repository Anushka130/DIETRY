const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("🔍 Request Headers:", req.headers); // Debugging

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log(" No token provided in request!");
    return res.status(403).json({ message: "Access Denied. No token provided." });
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    console.log(" Invalid token format:", authHeader);
    return res.status(403).json({ message: "Invalid Token Format." });
  }

  const token = tokenParts[1];
  console.log("🔑 Extracted Token:", token);

  jwt.verify(token, "diet", (err, decoded) => {
    if (err) {
      console.log("JWT Verification Error:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token Expired. Please log in again." });
      }
      return res.status(401).json({ message: "Invalid Token" });
    }
    console.log(" Decoded User:", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
