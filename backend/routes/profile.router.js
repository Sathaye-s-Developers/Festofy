const router = require("express").Router();
const User = require("../Model/user.model");
const verifyToken = require("../middlewares/token_varification");

//set profile
router.post("/set-profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { department, year, phone, username } = req.body;

    // if (!department || !year || !phone) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "All fields are required" });
    // }
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exists." });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { department, year, phone, username },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;