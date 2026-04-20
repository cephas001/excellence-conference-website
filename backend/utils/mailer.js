// backend/utils/mailer.js
const ejs = require("ejs");
const path = require("path");
const Jimp = require("jimp");
const generateTicketImage = require("./generateTicketImage");

const ticketImages = {
  "Love Tribe": "love_tribe.jpeg",
  "Grace Tribe": "grace_tribe.jpeg",
  "Peace Tribe": "peace_tribe.jpeg",
  "Bond Tribe": "bond_tribe.jpeg",
  "Fire Tribe": "fire_tribe.jpeg",
  "Light Tribe": "light_tribe.jpeg",
  "Joy Tribe": "joy_tribe.jpeg",
  "Healing Tribe": "healing_tribe.jpeg",
};

const sendTicketEmail = async (recipientEmail, applicantName, tableChoice) => {
  try {
    const templatePath = path.join(__dirname, "../templates/ticket.ejs");
    const fileName = ticketImages[tableChoice] || "love_tribe.jpeg";
    const baseImagePath = path.join(__dirname, `../assets/tickets/${fileName}`);

    // ==========================================
    // 1. Dynamic Image Generation
    // ==========================================
    const base64Ticket = await generateTicketImage(
      baseImagePath,
      applicantName,
    );

    // ==========================================
    // 2. HTML Rendering & Brevo API Dispatch
    // ==========================================
    const htmlContent = await ejs.renderFile(templatePath, {
      applicantName: applicantName || "Worker",
      tableChoice: tableChoice || "General Seating",
    });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Excellence Conference",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: recipientEmail }],
        subject: "Your Official Ticket: Excellence Conference Workers Dinner",
        htmlContent: htmlContent,
        attachment: [
          {
            name: "customizedTicket.png",
            content: base64Ticket,
          },
          {
            name: `${(applicantName || "Worker").replace(/\s+/g, "_")}_Ticket.png`,
            content: base64Ticket,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error Details:", errorData);
      throw new Error(`Brevo rejected the request: ${errorData.message}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    return false;
  }
};

module.exports = { sendTicketEmail };
