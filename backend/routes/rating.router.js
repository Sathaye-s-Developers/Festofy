const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/token_varification");
const Rating = require("../Model/rating.model");
const Event = require("../Model/event.module");
//const { users } = require("../Model/user.model");

// Add or Update Rating for an Event
router.post("/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Add or update rating
    const updatedRating = await Rating.findOneAndUpdate(
      { eventId, userId },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate average rating for the event
    const ratings = await Rating.find({ eventId });
    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    // Save average rating in Event model
    event.averageRating = avgRating.toFixed(1); // store as 1 decimal place
    await event.save();

    res.json({
      message: "Rating submitted successfully",
      rating: updatedRating,
      averageRating: avgRating.toFixed(1),
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/rating.routes.js
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get all ratings for the event
    const ratings = await Rating.find({ eventId })
      .populate("userId", "name email") // only get name & email from User
      .sort({ createdAt: -1 }); // newest first

    if (!ratings.length) {
      return res
        .status(404)
        .json({ message: "No ratings found for this event" });
    }

    // Calculate average
    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    res.json({
      averageRating: avgRating.toFixed(1),
      totalRatings: ratings.length,
      ratings, // list of all ratings
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;