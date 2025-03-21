require("dotenv").config();
const { google } = require("googleapis");
const GoogleMeeting = require("./google_meet.model");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

exports.createMeeting = async (req, res) => {
  try {
    
    console.log("Visit this URL to authorize:", oauth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/calendar.events"] }));
    const code = readline.question("Enter the code from Google: ");
    
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error getting token", err);
      console.log("Your refresh token:", token.refresh_token);
    });
    
    if (req.body.role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can create meetings" });
    }

    const { title, startTime, endTime, allowedStudents } = req.body;
    const event = {
      summary: title,
      start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
      end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 15),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };
    console.log(event);
    

    // ✅ Fixed: Ensure meeting creation waits for completion
    const meeting = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1
    });

    const newMeeting = new GoogleMeeting({
      title,
      instructor: req.user.userId,
      startTime,
      endTime,
      meetingLink: meeting.data.hangoutLink,
      allowedStudents,
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    console.error("Meeting creation failed:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

exports.joinMeeting = async (req, res) => {
  try {
    const meeting = await GoogleMeeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" }); // ✅ Added 404 check
    }

    if (!meeting.allowedStudents.includes(req.user.email)) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ meetingLink: meeting.meetingLink });
  } catch (error) {
    console.error("Error joining meeting:", error);
    res.status(500).json({ error: "Error joining meeting" });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    console.log("Visit this URL to authorize:", oauth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/calendar.events"] }));
    const code = readline.question("Enter the code from Google: ");
    
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error getting token", err);
      console.log("Your refresh token:", token.refresh_token);
    });
    const meetings = await GoogleMeeting.find();
    res.status(200).json(meetings); // ✅ Fixed status code from 500 to 200
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Error fetching meetings" });
  }
};
