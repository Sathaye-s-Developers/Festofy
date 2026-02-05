const router = require("express").Router();
const Participation = require("../Model/participation.model");
const User = require("../Model/user.model");
const Event = require("../Model/event.module");
const SubEvent = require("../Model/subevent.model");
const verifyToken = require("../middlewares/token_varification");
const Volunteer = require("../Model/volunteer.model");
const is_admin = require("../middlewares/is_admin");
const sub_head = require("../middlewares/Subevent_head");
const { generateTicket } = require("../email_services/EmailService");
const isAdmin = require("../middlewares/is_admin");

// Register participant for event or sub-event
router.post("/register", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      eventId,
      roll_no,
      subEventId = null,
      teamName = null,
      members = null,
      collegeName = null,
      contact = null,
      TransactionId = null
    } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, error: "Event ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const department=user.department

    // user are already register as Volunteer
    const alreadyVolunteer = await Volunteer.findOne({
      email: user.email,
      eventId,
      subEventId,
    });
    if (alreadyVolunteer) {
      return res.status(400).json({
        success: false,
        error:
          "User is already a volunteer in this event, cannot register as participant",
      });
    }

    //  Check if already registered (user-based, not just email/teamName)
    const alreadyRegistered = await Participation.findOne({
      userId,
      eventId,
      subEventId: subEventId || null, // null means main event
    });

    if (alreadyRegistered) {
      return res
        .status(409)
        .json({ success: false, error: "You are already registered for this event/sub-event" });
    }


    // Proceed with subEvent checks
    let subEvent = null;
    if (subEventId) {
      subEvent = await SubEvent.findById(subEventId);
      if (!subEvent)
        return res.status(404).json({ success: false, error: "Sub-event not found" });
    }

    // Check participant limits
    let currentCount = await Participation.countDocuments({
      eventId,
      ...(subEventId ? { subEventId } : { subEventId: null }),
    });
    const maxAllowed = subEventId
      ? subEvent?.maxParticipants
      : (await Event.findById(eventId))?.maxParticipants;
    if (maxAllowed && currentCount >= maxAllowed) {
      return res.status(400).json({ success: false, error: "Participant limit reached" });
    }

    // Save participation
    let newParticipant;
    if (subEvent?.participation_type === "team") {
      if (!teamName || !members?.length) {
        return res
          .status(400)
          .json({ success: false, error: "Team name and members required for team event" });
      }
      newParticipant = new Participation({
        userId,
        eventId,
        roll_no,
        subEventId,
        participantName: user.username,
        participantEmail: user.email,
        participantPhone: user.phone,
        college: user.collegeName,
        year: user.year,
        department: department,
        team: { teamName, members, collegeName, contact },
        TransactionId
      });
    } else {
      newParticipant = new Participation({
        userId,
        eventId,
        roll_no,
        subEventId,
        participantName: user.username,
        participantEmail: user.email,
        participantPhone: user.phone,
        college: user.collegeName,
        year: user.year,
        department: department,
        team: { teamName, members, collegeName, contact },
        TransactionId
      });
    }

    const savedParticipant = await newParticipant.save();

    // Update references
    await User.findByIdAndUpdate(userId, {
      $push: { participations: savedParticipant._id },
    });
    await Event.findByIdAndUpdate(eventId, {
      $push: { participants: savedParticipant._id },
    });
    if (subEventId) {
      await SubEvent.findByIdAndUpdate(subEventId, {
        $push: { participants: savedParticipant._id },
      });
    }
    //  Fetch details
    const event = await Event.findById(eventId);

    // Generate Ticket
    generateTicket(user, event, subEvent, savedParticipant._id, user.email);
    
    res.status(201).json({
      success: true,
      message: "Participant registered successfully",
      data: savedParticipant,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message });
  }
});

//  Get all participants for a specific sub-event
router.get("/subevent/:subEventId/participants", verifyToken, isAdmin || sub_head,async (req, res) => {
  try {
    const { subEventId } = req.params;

    const participants = await Participation.find({ subEventId });

    if (!participants || participants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No participants found for this sub-event",
      });
    }

    res.status(200).json({
      success: true,
      message: "Participants fetched successfully",
      participants,
    });
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET all participants (main event + sub-events)
router.get("/event/:eventId/all-participants", verifyToken, is_admin, async (req, res) => {
  try {
    const { eventId } = req.params;

    const participants = await Participation.find({ eventId });

    if (!participants || participants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No participants found for this event",
      });
    }

    res.status(200).json({
      success: true,
      message: "All participants for this event fetched successfully",
      participants,
    });
  } catch (err) {
    console.error("Error fetching event participants:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//delete
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const participantId = req.params.id;

    const participant = await Participation.findById(participantId);
    if (!participant) {
      return res
        .status(404)
        .json({ success: false, message: "Participant not found" });
    }

    //  Remove from Event
    await Event.findByIdAndUpdate(participant.eventId, {
      $pull: { participants: participant._id },
    });

    //remove  form user
    await User.findByIdAndUpdate(participant.userId, {
      $pull: { participations: participant._id },
    });

    // Remove from SubEvent
    if (participant.subEventId) {
      await SubEvent.findByIdAndUpdate(participant.subEventId, {
        $pull: { participants: participant._id },
      });
    }

    //  delete the document
    await participant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Participant deleted and unlinked successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;