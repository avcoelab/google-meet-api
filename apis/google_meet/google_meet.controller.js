
const { google } = require('googleapis');
const { oauth2Client } = require('./generate-token');
const Meeting = require('./google_meet.model');

exports.getAuthUrl = (req, res) => {
  const { getAuthUrl } = require('./generate-token');
  res.json({ authUrl: getAuthUrl() });
};

exports.handleCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Store tokens securely in your database associated with the user
    res.redirect('/meetings/create');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMeeting = async (req, res) => {
  const { title, startTime, endTime, attendees } = req.body;
  // Assuming userId comes from authentication middleware
  const userId = 'user123'; // Replace with actual user authentication

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: title,
      start: { dateTime: startTime, timeZone: 'America/Los_Angeles' },
      end: { dateTime: endTime, timeZone: 'America/Los_Angeles' },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    });

    const meeting = new Meeting({
      title,
      startTime,
      endTime,
      attendees,
      googleEventId: response.data.id,
      meetLink: response.data.hangoutLink,
      userId
    });

    await meeting.save();
    res.status(201).json({
      message: 'Meeting created successfully',
      meeting,
      meetLink: response.data.hangoutLink
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ userId: 'user123' }); // Replace with actual user ID
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};