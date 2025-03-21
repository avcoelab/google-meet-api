// generate-token.js
require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline-sync");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

console.log("Visit this URL to authorize:", oauth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/calendar.events"] }));
const code = readline.question("Enter the code from Google: ");

oauth2Client.getToken(code, (err, token) => {
  if (err) return console.error("Error getting token", err);
  console.log("Your refresh token:", token.refresh_token);
});
