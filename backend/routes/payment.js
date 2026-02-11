// payment.route.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { generateTicket } = require("../email_services/EmailService");

const Participation = require("../Model/participation.model");
const Event = require("../Model/event.module");
const SubEvent = require("../Model/subevent.model");
const User = require("../Model/user.model");
const verifyToken = require("../middlewares/token_varification");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Create Razorpay Order
// Create Razorpay Order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId, subEventId, phone } = req.body;

    // Validate eventId
    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, error: "Event ID is required" });
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid phone number" });
    }

    // Fetch user
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let amount;

    // Fetch price from sub-event if provided
    if (subEventId) {
      const subEvent = await SubEvent.findById(subEventId).lean();
      if (!subEvent) {
        return res
          .status(404)
          .json({ success: false, error: "SubEvent not found" });
      }
      amount = subEvent.price;
    } else {
      // Else, fetch from main event
      const event = await Event.findById(eventId).lean();
      if (!event) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found" });
      }
      amount = event.price;
    }

    // Check if amount is valid
    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid event/sub-event amount" });
    }

    // Prevent duplicate confirmed registrations
    const alreadyRegistered = await Participation.findOne({
      participantEmail: user.email,
      eventId,
      subEventId: subEventId || null,
      status: "confirmed",
      isPaid: true,
    }).lean();

    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        error: "Already registered for this event/sub-event",
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      participant: {
        name: user.username,
        email: user.email,
        phone,
        college: user.collegeName,
      },
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create order" });
  }
});

//  Verify Payment & Save Participation
router.post("/verify-payment", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      subEventId,
      phone,
      roll_no,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }
    const user = await User.findById(userId).lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify Razorpay signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }
    // Fetch event/subEvent & price
    let subEvent = null;
    let amount = 0;

    if (subEventId) {
      subEvent = await SubEvent.findById(subEventId).lean();
      if (!subEvent)
        return res.status(404).json({ error: "SubEvent not found" });
      amount = subEvent.price;
    } else {
      const event = await Event.findById(eventId).lean();
      if (!event) return res.status(404).json({ error: "Event not found" });
      amount = event.price;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid event/sub-event amount" });
    }

    // Prevent duplicate confirmed registrations
    const alreadyRegistered = await Participation.findOne({
      participantEmail: user.email,
      eventId,
      subEventId: subEventId || null,
      isPaid: true,
    }).lean();

    if (alreadyRegistered) {
      return res.status(409).json({ error: "Already registered" });
    }

    // Save participation
    const newParticipant = new Participation({
      userId: userId,
      participantName: user.username,
      participantEmail: user.email,
      participantPhone: phone,
      college: user.collegeName,
      eventId,
      subEventId: subEventId || null,
      status: "confirmed",
      isPaid: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      paidAt: new Date(),
      roll_no: roll_no,
      year: user.year,
    });

    const savedParticipant = await newParticipant.save();

    // Update references
    await User.findByIdAndUpdate(userId, {
      $push: { participations: savedParticipant._id },
    });

    // Link to Event
    await Event.findByIdAndUpdate(eventId, {
      $push: { participants: savedParticipant._id },
    });
    if (subEventId) {
      await SubEvent.findByIdAndUpdate(subEventId, {
        $push: { participants: savedParticipant._id },
      });
    }

    //  Generate ticket
    const event = await Event.findById(eventId);
    generateTicket(user, event, subEvent, savedParticipant._id, user.email);

    return res.json({
      success: true,
      message: "Payment verified and participation saved",
      data: savedParticipant,
    });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
