const express = require("express");
const { createMeeting, joinMeeting,getMeeting } = require("./google_meet.controller");
const router = express.Router();

router.post("/", createMeeting);
router.get("/", getMeeting);
router.get("/join-meeting/:id", joinMeeting);

module.exports = router;
