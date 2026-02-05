const express = require("express");
const router = express.Router();
const User = require("../Model/user.model");
const verifyToken = require("../middlewares/token_varification");
const authorizeSuperadmin = require("../middlewares/is_superadmin");

// Middleware to verify superadmin role
router.use(verifyToken, authorizeSuperadmin);

// @desc    Get all pending admin requests
// @route   GET /api/superadmin/requests
// @access  Private (Superadmin)
router.get("/requests", async (req, res) => {
  try {
    const pendingRequests = await User.find({
      isAdminRequested: true,
      "adminRequest.status": "pending",
    }).select("-password");

    res.json({
      success: true,
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Approve admin request
// @route   PUT /api/superadmin/approve/:userId
// @access  Private (Superadmin)
router.put("/approve/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body; // Optional approval reason

    const user = await User.findById(userId);

    if (!user || !user.isAdminRequested) {
      return res.status(404).json({
        success: false,
        message: "No pending admin request found for this user",
      });
    }

    if (user.adminRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    user.role = "admin";
    user.adminRequest.status = "approved";
    user.adminRequest.reason = reason || "Approved by superadmin";
    user.adminRequest.processedAt = new Date();
    user.adminRequest.processedBy = req.user._id;

    await user.save();

    res.json({
      success: true,
      message: "Admin access granted successfully",
      data: {
        userId: user._id,
        email: user.email,
        newRole: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Reject admin request
// @route   PUT /api/superadmin/reject/:userId
// @access  Private (Superadmin)
router.put("/reject/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body; // Required rejection reason

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejection",
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.isAdminRequested) {
      return res.status(404).json({
        success: false,
        message: "No pending admin request found for this user",
      });
    }

    if (user.adminRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    user.isAdminRequested = false;
    user.adminRequest.status = "rejected";
    user.adminRequest.reason = reason;
    user.adminRequest.processedAt = new Date();
    user.adminRequest.processedBy = req.user._id;

    await user.save();

    res.json({
      success: true,
      message: "Admin request rejected successfully",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Get all admins
// @route   GET /api/superadmin/admins
// @access  Private (Superadmin)
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    }).select("-password");

    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Revoke admin privileges
// @route   PUT /api/superadmin/revoke/:userId
// @access  Private (Superadmin)
router.put("/revoke/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body; // Required reason

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for revoking admin privileges",
      });
    }

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "No admin found with this ID",
      });
    }

    user.role = "user";
    user.adminRevoked = {
      reason,
      revokedAt: new Date(),
      revokedBy: req.user._id,
    };

    await user.save();

    res.json({
      success: true,
      message: "Admin privileges revoked successfully",
      data: {
        userId: user._id,
        email: user.email,
        newRole: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;