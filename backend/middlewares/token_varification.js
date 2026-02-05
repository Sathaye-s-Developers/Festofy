const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  console.log("working");
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]
  // console.log("Cookies:", token);
  
  if (!token) {
    return res.status(401).json({ message: "Token missing from cookie" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyToken;