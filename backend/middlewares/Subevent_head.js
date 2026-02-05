function Subevent_head(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role !== "subEventHead") {
    return res
      .status(403)
      .json({ message: "Access denied: SubEventHeads only" });
  }

  next();
}

module.exports = Subevent_head;