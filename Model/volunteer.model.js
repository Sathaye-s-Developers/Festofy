const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  roll_no: {
    type: String,
    required: true,
    trim: true,
  },
  position:{ type:String ,default:"volunteer"},
  phone: { type: String, trim: true },
  college: { type: String, required: true },
  department: { type: String },
  year: { type: String },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  subEventId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
    },
  ],
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;