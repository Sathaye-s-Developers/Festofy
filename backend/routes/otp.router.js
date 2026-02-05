// routes/otp.router.js
const router = require("express").Router();
const {
  generateOTP,
  sendOTP,
  sendConfirmationEmail,
  sendForgotPasswordEmail,
} = require("../email_services/EmailService");
const User = require("../Model/user.model");
const verifyToken = require("../middlewares/token_varification");

const otpStore = new Map(); // { email: { otp, expiresAt } }

//  Send OTP for Registration
router.post("/register-login", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, message: "Valid email required" });
  }

  try {
    const otp = generateOTP();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Respond immediately, send email asynchronously for faster response
    res.status(200).json({ success: true, message: "OTP is being sent" });

    // Send OTP email in background
    sendOTP(email, otp).catch((err) =>
      console.error("OTP (register) send failed:", err)
    );
  } catch (err) {
    console.error("OTP (register) send failed:", err);
    // Only log error, response already sent
  }
});
//  Send OTP for Forgot Password
router.post("/forgot", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, message: "Valid email required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Email not found in system" });
  }

  try {
    const otp = generateOTP();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Respond immediately, send email asynchronously for faster response
    res.status(200).json({ success: true, message: "OTP is being sent" });

    // Send OTP email in background
    sendForgotPasswordEmail(email, otp).catch((err) =>
      console.error("OTP (forgot) send failed:", err)
    );
  } catch (err) {
    console.error("OTP (forgot) send failed:", err);
    // Only log error, response already sent
  }
});

//  Verify OTP (protected, requires login)
router.post("/verify-otp", verifyToken, async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP required" });

  const stored = otpStore.get(email);
  if (!stored)
    return res
      .status(400)
      .json({ success: false, message: "OTP expired or not found" });
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: "OTP expired" });
  }
  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  otpStore.delete(email);

  // Registration confirm email (send in background for speed)
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, message: "OTP verified" });

  // Send confirmation email asynchronously
  sendConfirmationEmail(email, user.username).catch((e) =>
    console.error("Confirmation email failed:", e)
  );
});

// Public OTP Verification (no login)
router.post("/verify-otp-public", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  // Check if email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email not registered in the system",
    });
  }

  const stored = otpStore.get(email);
  if (!stored) {
    return res.status(400).json({
      success: false,
      message: "OTP expired or not found",
    });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(email);

  // Respond immediately for speed
  res.status(200).json({
    success: true,
    message: "OTP verified",
  });
});

module.exports = router;