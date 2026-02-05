const express = require("express");
const router = express.Router();
const Event = require("../Model/event.module");
const SubEvent = require("../Model/subevent.model");
const Volunteer = require("../Model/volunteer.model");
const User = require("../Model/user.model");
const verifyToken = require("../middlewares/token_varification");
const isAdmin = require("../middlewares/is_admin");

// CREATE Event with enhanced validation and security
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const { username, collegeName } = user;
    const {
      organiser_name,
      title,
      department,
      description,
      bannerUrl,
      location,
      agenda,
      requirements,
      dateRange,
      tags,
      visibility = "college", // Default to college visibility
      price = 0,
      event_mode = "free", // Default to free event
      phone,
      time
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "title",
      "department",
      "description",
      "bannerUrl",
      "dateRange",
      "location",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "All Fields Are Required",
        missingFields,
      });
    }


    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    // Remove time for date-only comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure start date is strictly in the future
    if (startDate <= today) {
      return res.status(400).json({
        error: "Start Date Must Be After Today's Date",
      });
    }

    // Ensure end date is after start date
    if (endDate <= startDate) {
      return res.status(400).json({
        error: "End Date Must Be After Start Date",
      });
    }


    // Check for duplicate event titles for this user
    const existingEvent = await Event.findOne({
      title: title.trim(),
      createdBy: userId,
    });

    if (existingEvent) {
      return res.status(400).json({
        error: "You Already Have An Event With This Title.",
      });
    }

    // Validate visibility options
    if (visibility === "explore" && !collegeName) {
      return res.status(400).json({
        error: "College Name Is Required For Explore Visibility",
      });
    }

    const newEvent = new Event({
      organiser_name: organiser_name || username,
      email: userEmail,
      title: title.trim(),
      department,
      description,
      bannerUrl,
      requirements,
      agenda,
      location,
      dateRange,
      tags,
      subEvents: [],
      volunteers: [],
      createdBy: userId,
      visibility,
      price,
      event_mode,
      createdByCollege: collegeName,
      phone,
      time
    });

    await newEvent.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while creating event",
      details: error.message,
    });
  }
});

// Get events created by the current admin
router.get("/admin-created-events", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ createdBy: userId }).sort({
      createdAt: -1,
    }); // Newest first

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch admin events",
      details: error.message,
    });
  }
});

// Get college-specific events (only visible within the same college)
router.get("/my-college-events", verifyToken, async (req, res) => {
  try {
    const collegeName = req.user.collegeName;

    //  console.log(collegeName);

    if (!collegeName) {
      return res.status(400).json({
        error: "User college information missing",
      });
    }

    const collegeEvents = await Event.find({
      visibility: "college",
      createdByCollege: collegeName,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    res.status(200).json({
      count: collegeEvents.length,
      collegeName,
      events: collegeEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch college events",
      details: error.message,
    });
  }
});

// Get explore events created by the same college
router.get("/my-college-explore-events", verifyToken, async (req, res) => {
  try {
    const collegeName = req.user.collegeName;

    if (!collegeName) {
      return res.status(400).json({
        error: "User college information missing",
      });
    }

    const exploreEvents = await Event.find({
      visibility: "explore",
      createdByCollege: collegeName,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    res.status(200).json({
      count: exploreEvents.length,
      collegeName,
      events: exploreEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch college explore events",
      details: error.message,
    });
  }
});

// Get all explore events (from all colleges)
router.get("/explore", verifyToken, async (req, res) => {
  try {
    const exploreEvents = await Event.find({ visibility: "explore" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username collegeName")
      .populate("subEvents");

    res.status(200).json({
      count: exploreEvents.length,
      events: exploreEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch explore events",
      details: error.message,
    });
  }
});

// Get sub-events for a specific event
router.get("/subevents/event/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        error: "Event ID is required",
      });
    }

    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    const subEvents = await SubEvent.find({ eventId }).sort({ startDate: 1 }); // Sort by start date

    res.status(200).json({
      count: subEvents.length,
      eventTitle: eventExists.title,
      subEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch sub-events",
      details: error.message,
    });
  }
});

// Get single event with detailed information
router.get("/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        error: "Event ID is required",
      });
    }

    const event = await Event.findById(eventId)
      .populate("createdBy", "username collegeName")
      .populate("subEvents")
      .populate("volunteers");

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    // Check if user has permission to view college-specific event
    if (
      event.visibility === "college" &&
      event.createdByCollege !== req.user.collegeName
    ) {
      return res.status(403).json({
        error: "Not authorized to view this college-specific event",
      });
    }

    res.status(200).json({
      event,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch event details",
      details: error.message,
    });
  }
});

// Update event with security checks
router.put("/update/:eventId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const updatedData = req.body;

    // First get the current event
    const currentEvent = await Event.findById(eventId);
    if (!currentEvent) {
      return res.status(404).json({
        success:false,
        error: "Event not found",
      });
    }

    // Verify ownership
    if (currentEvent.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success:false,
        error: "Not authorized to update this event",
      });
    }

    //  allow `collegeName` from clients and map to `createdByCollege`
    if (updatedData.collegeName && !updatedData.createdByCollege) {
      updatedData.createdByCollege = updatedData.collegeName;
      delete updatedData.collegeName;
    }

    //  rules
    // If visibility is set to "college" -> ensure createdByCollege exists (use provided or fallback to requester's college)
    if (updatedData.visibility === "college") {
      if (!updatedData.createdByCollege) {
        // prefer existing event college, otherwise use user's college from token
        updatedData.createdByCollege =
          currentEvent.createdByCollege || req.user.collegeName;
      }
    }

    // If visibility is set to "explore" -> remove any createdByCollege (optional) so it's global
    if (updatedData.visibility === "explore") {
      if ("createdByCollege" in updatedData) {
        // remove to avoid improper restriction
        delete updatedData.createdByCollege;
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success:true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      error: "Failed to update event",
      details: error.message,
    });
  }
});

// Delete event with cleanup of related data
router.delete("/delete/:eventId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!eventId) {
      return res.status(400).json({
        error: "Event ID is required",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    // Verify ownership
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "Not authorized to delete this event",
      });
    }

    // Clean up related data in parallel
    await Promise.all([
      event.volunteers?.length > 0 &&
      Volunteer.deleteMany({ _id: { $in: event.volunteers } }),
      event.subEvents?.length > 0 &&
      SubEvent.deleteMany({ _id: { $in: event.subEvents } }),
    ]);

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: "Event and related data deleted successfully",
      deletedEventId: eventId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete event",
      details: error.message,
    });
  }
});

module.exports = router;
