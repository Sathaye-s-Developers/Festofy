const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    subEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
      required: true,
    },
    hours:{
      type:String,
      trim:true,
      default:null
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId, // Admin who marked
      ref: "User",
    },
  },
  { timestamps: true }
);

// Unique constraint: same volunteer can’t be marked twice in the same subEvent for the same date
attendanceSchema.index(
  { volunteerId: 1, subEventId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);