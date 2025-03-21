const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  meetingLink: { type: String, required: true },
  allowedStudents: [{ type: String, required: true }], // Student emails
});

module.exports = mongoose.model("GoogleMeeting", meetingSchema);
