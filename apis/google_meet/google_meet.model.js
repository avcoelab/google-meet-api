const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  attendees: [{ email: { type: String, required: true } }],
  googleEventId: { type: String },
  meetLink: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
);

module.exports = mongoose.model('Meeting', meetingSchema);
