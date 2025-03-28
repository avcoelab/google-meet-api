
const express = require('express');
const router = express.Router();
const meetingController = require('./google_meet.controller');

router.get('/auth', meetingController.getAuthUrl);
router.get('/auth/google/callback', meetingController.handleCallback);
router.post('/create', meetingController.createMeeting);
router.get('/', meetingController.getMeetings);

module.exports = router;