const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema(
  {
    participantName: { type: String },
    participantEmail: { type: String, required: true, lowercase: true },
    participantPhone: { type: String, required: true },
    college: { type: String, required: true },
    TransactionId: { type: String, trim:true,default:null},
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    year: { type: String },
    subEventId: { type: mongoose.Schema.Types.ObjectId, ref: "SubEvent" }, // optional
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    roll_no: {
      type: String,
      required: true,
      trim: true,
    },
    department: { type: String },
    position: { type: String, default: "participant" },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    team: {
      teamName: String,
      members: [
        {
          name: String,
          email: String,
          roll_no: String,
          college_Name: String,
          contact: String,
        },
      ],
    },

    // type: {
    //   type: String,
    //   enum: ["college", "explore"],
    // },

    //  Razorpay payment fields
    isPaid: { type: Boolean, default: false },
    paymentId: { type: String },
    orderId: { type: String },
    amount: { type: Number },
    paidAt: { type: Date },
  },
  { timestamps: true }
);


participationSchema.index(
  { participantEmail: 1, eventId: 1 },
  { unique: true, partialFilterExpression: { subEventId: { $exists: false } } }
);

// Sub-event-level unique participation
participationSchema.index(
  { participantEmail: 1, eventId: 1, subEventId: 1 },
  { unique: true, partialFilterExpression: { subEventId: { $exists: true } } }
);

module.exports = mongoose.model("Participation", participationSchema);