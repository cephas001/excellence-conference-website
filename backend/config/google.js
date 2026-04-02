// backend/config/google.js
const { google } = require("googleapis");
const path = require("path");

// Define the scopes (permissions) the bot needs
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
];

// Initialize the Auth client
const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

// Initialize the Sheets and Drive APIs
const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

module.exports = {
  sheets,
  drive,
};
