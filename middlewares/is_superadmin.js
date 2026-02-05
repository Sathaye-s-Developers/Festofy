// middleware/authorize_superadmin.js

module.exports = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Superadmin privileges required to access this route",
    });
  }
  next();
};
