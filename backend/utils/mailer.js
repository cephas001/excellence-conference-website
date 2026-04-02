// backend/utils/mailer.js
const ejs = require("ejs");
const path = require("path");
const Jimp = require("jimp");

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
    // 1. Dynamic Image Generation with Jimp
    // ==========================================

    const image = await Jimp.read(baseImagePath);

    // DOWNGRADED FONT: 32px is much more proportional for a sleek tag
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const text = applicantName.toUpperCase();

    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, textWidth);

    // TIGHTER PADDING: Makes it look like a sleek modern label
    const paddingX = 40;
    const paddingY = 20;

    const boxWidth = textWidth + paddingX;
    const boxHeight = textHeight + paddingY;

    // TRUE CENTERING MATH:
    const centerX = image.bitmap.width * 0.63;
    const centerY = image.bitmap.height * 0.563;

    // Calculate top-left starting points by subtracting half the box size
    const tagX = centerX - boxWidth / 2;
    const tagY = centerY - boxHeight / 2;

    // Create the sleek white tag
    const whiteTag = await new Promise((resolve, reject) => {
      // 0xFFFFFFFF is solid white with full opacity (RGBA)
      new Jimp(boxWidth, boxHeight, 0xffffffff, (err, img) => {
        if (err) return reject(err);

        // This 'r' controls your border-radius.
        // 8 to 12 is usually the sweet spot for a Tailwind 'rounded-md' or 'rounded-lg' look.
        const r = 10;
        const w = boxWidth;
        const h = boxHeight;

        // Scan every pixel in the white box
        img.scan(0, 0, w, h, function (x, y, idx) {
          let cx, cy;
          let isCorner = false;

          // Detect if the current pixel is inside one of the 4 corners
          if (x < r && y < r) {
            cx = r;
            cy = r;
            isCorner = true; // Top-left
          } else if (x >= w - r && y < r) {
            cx = w - r - 1;
            cy = r;
            isCorner = true; // Top-right
          } else if (x < r && y >= h - r) {
            cx = r;
            cy = h - r - 1;
            isCorner = true; // Bottom-left
          } else if (x >= w - r && y >= h - r) {
            cx = w - r - 1;
            cy = h - r - 1;
            isCorner = true; // Bottom-right
          }

          // If it's a corner pixel, calculate its distance from the corner's center point
          if (isCorner) {
            const distance = Math.sqrt(
              Math.pow(x - cx, 2) + Math.pow(y - cy, 2),
            );
            // If the pixel falls outside the radius, set its Alpha channel to 0 (transparent)
            if (distance > r) {
              this.bitmap.data[idx + 3] = 0;
            }
          }
        });

        resolve(img);
      });
    });

    // Paste the tag and print the text (unchanged)
    image.composite(whiteTag, tagX, tagY);
    image.print(font, tagX + paddingX / 2, tagY + paddingY / 2, text);

    const ticketBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Convert the buffer to a base64 string for the Brevo API
    const base64Ticket = ticketBuffer.toString("base64");

    // ==========================================
    // 2. HTML Rendering & Brevo API Dispatch
    // ==========================================

    const htmlContent = await ejs.renderFile(templatePath, {
      applicantName: applicantName || "Worker",
      tableChoice: tableChoice || "General Seating",
    });

    // Using native fetch to bypass Render's SMTP port blocks
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
          email: process.env.EMAIL_USER, // This must be verified in Brevo
        },
        to: [{ email: recipientEmail }],
        subject: "Your Official Ticket: Excellence Conference Workers Dinner",
        htmlContent: htmlContent,
        attachment: [
          // Attachment 1: The "Inline" version.
          // Brevo requires the "name" here to exactly match the "cid" used in your EJS template's <img> tag
          {
            name: "customizedTicket.png",
            content: base64Ticket,
          },
          // Attachment 2: The standard downloadable file with a clean name
          {
            name: `${applicantName.replace(/\s+/g, "_")}_Ticket.png`,
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

    const result = await response.json();
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    return false;
  }
};

module.exports = { sendTicketEmail };
