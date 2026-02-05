const router = require("express").Router();
const User = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const {
  sendPasswordChangedConfirmation,
} = require("../email_services/EmailService");

//  Reset Password Route
router.patch("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Email and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Optional: check if update failed
    if (!updatedUser) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update password" });
    }

    //  Send confirmation email only after update
    await sendPasswordChangedConfirmation(email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(" Password reset failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
});

module.exports = router;