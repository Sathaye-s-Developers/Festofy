const express = require("express");
const router = express.Router();
const SubEvent = require("../Model/subevent.model");
const Event = require("../Model/event.module");
const isAdmin = require("../middlewares/is_admin");
const verifyToken = require("../middlewares/token_varification");

// 🔹 Create SubEvent
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, date, time, location, eventId, price = 0, duration, SubEventType, requirements, prizes, maxParticipants,maxVoleenters, subEventCategory,QrScanner, participation_type = "solo" } = req.body;

    if (!eventId || !title || !date) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields (eventId, title, date)" });
    }

    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ success: false, error: " Event not found" });
    }

    const duplicateSubEvent = await SubEvent.findOne({
      eventId,
      title: title.trim(),
    });

    if (duplicateSubEvent) {
      return res.status(409).json({
        error: "A SubEvent with this title already exists for this event.",
      });
    }

    const newSubEvent = new SubEvent({
      title,
      description,
      date,
      time,
      location,
      eventId,
      price,
      duration,
      SubEventType,
      requirements,
      prizes,
      maxParticipants,
      subEventCategory,
      participation_type,
      maxVoleenters,
      QrScanner
    });

    const savedSubEvent = await newSubEvent.save();

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $push: { subEvents: savedSubEvent._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "SubEvent created and linked to Event",
      subEvent: savedSubEvent,
      updatedEvent,
    });
  } catch (err) {
    success: false,
      console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// GET sub-events filtered by section (college or global)
router.get("/section/:eventType", verifyToken, async (req, res) => {
  try {
    const { eventType } = req.params;
    const userCollege = req.user.collegeName;

    let eventFilter = {};

    if (eventType === "college") {
      eventFilter = {
        eventType: "college",
        createdByCollege: userCollege,
      };
    } else if (eventType === "explore") {
      eventFilter = {
        eventType: "explore",
      };
    } else {
      return res.status(400).json({ error: "Invalid event type" });
    }

    // Find matching events first
    const matchedEvents = await Event.find(eventFilter).select("_id");
    const eventIds = matchedEvents.map((e) => e._id);

    // Fetch sub-events linked to those event IDs
    const subEvents = await SubEvent.find({ eventId: { $in: eventIds } });

    res.status(200).json({ subEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set SubEvent Head Key (only by Event Admin)
router.post("/set_SubEventHead", verifyToken, isAdmin, async (req, res) => {
  try {
    const { headKey, subEventId } = req.body;
    // Find sub-event and populate event
    const subEvent = await SubEvent.findById(subEventId).populate("eventId");
    if (!subEvent) {
      return res.status(404).json({success:false, message: "SubEvent not found" });
    }
    // Update subEvent with new headKey
    subEvent.headKey = headKey;
    await subEvent.save();

    return res.status(200).json({
      success:true, 
      message: "Head key set successfully for SubEvent",
      subEvent,
    });
  } catch (err) {
    console.error("Error setting SubEvent Head key:", err);
    return res.status(500).json({success:false,  message: "Server error", error: err });
  }
});


//  Update SubEvent  //additionls
router.patch("/update", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      subEventId,
      title,
      description,
      date,
      time,
      price,
      event_mode,
      location,
      participation_type,
      maxParticipants,
      maxVolunteers,
      duration,
      subEventCategory,
      requirements,
      prizes,
      QrScanner
    } = req.body;

    if (!subEventId) {
      return res.status(400).json({success:false, error: "subEventId is required" });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (date) updateFields.date = date;
    if (time) updateFields.time = time;
    if (location) updateFields.location = location;
    if (participation_type)
      updateFields.participation_type = participation_type;
    if (maxParticipants) updateFields.maxParticipants = maxParticipants;
    if (maxVolunteers) updateFields.maxVolunteers = maxVolunteers;
    if (price) updateFields.price = price;
    if (event_mode) updateFields.event_mode = event_mode;
    if (duration) updateFields.duration = duration;
    if (subEventCategory) updateFields.subEventCategory = subEventCategory;
    if (requirements) updateFields.requirements = requirements;
    if (prizes) updateFields.prizes = prizes;
    if (QrScanner) updateFields.QrScanner=QrScanner;

    const updated = await SubEvent.findByIdAndUpdate(subEventId, updateFields, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ success:false,error: "SubEvent not found" });
    }

    res.status(200).json({success:true, message: "SubEvent updated", subEvent: updated });
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
});

// Delete SubEvent by ID
router.delete("/delete", verifyToken, isAdmin, async (req, res) => {
  try {
    const { subEventId } = req.body;

    if (!subEventId) {
      return res.status(400).json({ error: " subEventId is required in body" });
    }

    //  Find and delete the subevent
    const subEvent = await SubEvent.findByIdAndDelete(subEventId);

    if (!subEvent) {
      return res
        .status(404)
        .json({ error: " SubEvent not found or already deleted" });
    }

    // Remove subEvent reference from the parent Event
    await Event.findByIdAndUpdate(subEvent.eventId, {
      $pull: { subEvents: subEventId },
    });

    res.status(200).json({
      message: "SubEvent deleted successfully",
      deletedSubEvent: subEvent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get SubEvent by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const subEvent = await SubEvent.findById(req.params.id)
      // .populate("volunteers")
      .populate("participants");

    if (!subEvent) {
      return res.status(404).json({success:false, error: "SubEvent not found" });
    }

    res.status(200).json({success:true, subEvent });
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
});

//  Get All SubEvent for specific Event
router.get("/event/:eventId", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ error: " Event not found" });
    }

    const subEvents = await SubEvent.find({ eventId });
    res.status(200).json({ subEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;