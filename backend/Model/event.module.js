const mongoose = require("mongoose");
const { trim } = require("validator");

const eventSchema = new mongoose.Schema({
  organiser_name: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [13, "Email must be at least 13 characters long"],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  bannerUrl: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  dateRange: {
    start: Date,
    end: Date,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  time:{
    type:String,
    trim: true,
    required:true
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  requirements: {
    type: String,
    trim: true,
  },
  agenda: {
    type: String,
    trim: true
  },
  event_mode: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },

  //Visibility logic: 'college' or 'explore'
  visibility: {
    type: String,
    enum: ["college", "explore"],
    default: "college",
  },
  phone: {
    type: String,
    trim: true
  },
  //max limit for participants and volunteers
  // maxParticipants: { type: Number, default: 1000 }, // Event-level limit
  // maxVolunteers: { type: Number, default: 1000 }, // Event-level limit

  createdByCollege: {
    type: String,
    required: true, //filtering collage event
  },

  subEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
    },
  ],
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

  attendance: [
    {
      volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" },
      date: { type: Date, required: true },
      status: { type: String, enum: ["present", "absent"], default: "present" },
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);