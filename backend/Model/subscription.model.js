const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    eventLimit: {
      type: Number, // e.g., 1, 3, 5
      default: null, // null = unlimited
    },
    eventsCreated: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    packageName: {
      type: String, // e.g., "Starter 1 Event", "Pro 3 Events"
    },
    purchaseId: {
      type: String, // Razorpay payment ID (optional)
    },
  },
  { timestamps: true }
);

// Index for quick active subscription lookups
SubscriptionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("Subscription", SubscriptionSchema);