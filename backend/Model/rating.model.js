// models/rating.model.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Reference to the Event model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to User so a user can only rate once
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate ratings from same user for same event
ratingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);