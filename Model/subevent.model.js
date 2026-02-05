const mongoose = require("mongoose");

const subEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    required: false,
    trim: true,
  },
  subEventCategory: {
    type: String,
    trim: true,
  },
  requirements: {
    type: String,
    trim: true,
  },
  QrScanner: {
    type: String,
    trim: true,
    default:null
  },
  prizes: {
    type: [String],
    trim: true,
  },
  maxParticipants: { type: Number, default: 1000 },
  maxVoleenters: { type: Number, default: 1000 },
  duration: {
    type: String,
    required: false,
    trim: true,
  },
  event_mode: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  time: {
    type: String, // optional: store as string "10:30 AM"
  },


  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  headKey: {
    type: String, // secret key for becoming head
    default: null,
  },

  maxParticipants: { type: Number, default: 1000000},
  maxVolunteers: { type: Number, default: 1000000},

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participation",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  participation_type: { type: String, enum: ["solo", "team"], default: "solo" },
});

const SubEvent = mongoose.model("SubEvent", subEventSchema);

module.exports = SubEvent;