// backend/routes/applications.js
const express = require("express");
const { sheets, drive } = require("../config/google");
const router = express.Router();
const { sendTicketEmail } = require("../utils/mailer");

const { verifyToken, requireDynamicTypeAccess } = require("../middleware/auth");

// Helper function to convert Google Sheets array data into JSON objects
const formatSheetData = (rows) => {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const data = rows.slice(1);

  return data.map((row, rowIndex) => {
    let rowObject = { _rowIndex: rowIndex + 2 }; // Keep track of the actual row number for updates later
    headers.forEach((header, index) => {
      rowObject[header] = row[index] || ""; // If a cell is blank, return an empty string
    });
    return rowObject;
  });
};

// backend/routes/applications.js (or wherever your routes are)
// 1. SPECIFIC ROUTE GOES FIRST (Basic authentication required)
router.get("/workers", verifyToken, async (req, res) => {
  try {
    // Fetch both the Workers and Executives sheets simultaneously
    const [workersResponse, execsResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID_WORKERS,
        // Changed back to the default Google Forms tab name
        range: "'Form Responses 1'!B2:C",
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID_EXECUTIVES,
        // Changed back to the default Google Forms tab name
        range: "'Form Responses 1'!B2:C",
      }),
    ]);

    // Helper function to map the raw rows into clean objects
    const formatData = (rows) => {
      if (!rows) return [];
      return rows
        .map((row) => ({
          name: row[0] ? row[0].trim() : "",
          // If they didn't fill in a unit, provide a fallback
          unit: row[1] ? row[1].trim() : "Unassigned",
        }))
        .filter((person) => person.name !== ""); // Remove empty rows
    };

    const workers = formatData(workersResponse.data.values);
    const executives = formatData(execsResponse.data.values);

    // Merge both arrays into one master list
    const combinedDatabase = [...workers, ...executives];

    res.status(200).json({ data: combinedDatabase });
  } catch (error) {
    console.error("Failed to fetch workers and executives:", error);
    res.status(500).json({ error: "Could not fetch the personnel databases." });
  }
});

// --- GET ALL APPLICATIONS (Protected by Type) ---
// We use a dynamic parameter /:type to handle both 'dinner' and 'merch'
router.get("/:type", verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    let spreadsheetId = "";
    let range = "Form Responses 1"; // Default tab name for Google Forms

    // Determine which sheet to pull from based on the URL
    if (type === "dinner") {
      spreadsheetId = process.env.SHEET_ID_DINNER;
    } else if (type === "merch") {
      spreadsheetId = process.env.SHEET_ID_MERCH;
    } else {
      return res.status(400).json({
        error: 'Invalid application type. Use "dinner" or "merch".',
      });
    }

    // Fetch the data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    const formattedData = formatSheetData(rows);

    res.status(200).json({
      message: `Successfully fetched ${type} applications`,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Google Sheets fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data from Google Sheets." });
  }
});

// Helper function to convert a column index (0, 1, 2) to a letter (A, B, C)
const getColumnLetter = (colIndex) => {
  let letter = "";
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

// --- UPDATE STATUS (Protected by Type) ---
router.patch(
  "/:type/status",
  verifyToken,
  requireDynamicTypeAccess,
  async (req, res) => {
    try {
      const { type } = req.params;
      const {
        rowIndex,
        status,
        comment,
        applicantEmail,
        applicantName,
        tableChoice,
        reviewerEmail,
      } = req.body;

      if (!rowIndex || !status) {
        return res.status(400).json({ error: "Missing rowIndex or status." });
      }

      let spreadsheetId =
        type === "dinner"
          ? process.env.SHEET_ID_DINNER
          : process.env.SHEET_ID_MERCH;

      // 1. Fetch headers to dynamically find columns
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "'Form Responses 1'!1:1",
      });

      const headers = headerResponse.data.values
        ? headerResponse.data.values[0]
        : [];

      let statusColIndex = headers.findIndex(
        (h) => h.trim().toLowerCase() === "status",
      );
      let commentColIndex = headers.findIndex(
        (h) =>
          h.trim().toLowerCase() === "comments" ||
          h.trim().toLowerCase() === "comment",
      );

      let emailStatusColIndex = headers.findIndex(
        (h) => h.trim().toLowerCase() === "email status",
      );

      let reviewerColIndex = headers.findIndex(
        (h) => h.trim().toLowerCase() === "reviewer",
      );

      let headersUpdated = false;

      if (statusColIndex === -1) {
        statusColIndex = headers.length;
        headers.push("Status");
        headersUpdated = true;
      }
      if (commentColIndex === -1) {
        commentColIndex = headers.length;
        headers.push("Comments");
        headersUpdated = true;
      }
      if (emailStatusColIndex === -1) {
        emailStatusColIndex = headers.length;
        headers.push("Email Status");
        headersUpdated = true;
      }
      if (reviewerColIndex === -1) {
        reviewerColIndex = headers.length;
        headers.push("REVIEWER");
        headersUpdated = true;
      }

      // 2. Prepare the Initial Batch Update (Status & Comment)
      const dataToUpdate = [];

      dataToUpdate.push({
        range: `'Form Responses 1'!${getColumnLetter(statusColIndex)}${rowIndex}`,
        values: [[status]],
      });

      if (comment !== undefined && comment !== null) {
        dataToUpdate.push({
          range: `'Form Responses 1'!${getColumnLetter(commentColIndex)}${rowIndex}`,
          values: [[comment]],
        });
      }

      if (headersUpdated) {
        dataToUpdate.push({
          range: "'Form Responses 1'!1:1",
          values: [[...headers]],
        });
      }

      if (reviewerEmail) {
        dataToUpdate.push({
          range: `'Form Responses 1'!${getColumnLetter(reviewerColIndex)}${rowIndex}`,
          values: [[reviewerEmail]],
        });
      }

      // 3. Execute Initial Update
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: dataToUpdate,
        },
      });

      // ==========================================
      // 4. SEND RESPONSE TO FRONTEND IMMEDIATELY (Unblocks UI)
      // ==========================================
      res.status(200).json({
        message: `Successfully updated row ${rowIndex} (Status: ${status})`,
      });

      // ==========================================
      // 5. BACKGROUND TASK: Send Email & Update Sheet
      // ==========================================
      if (type === "dinner" && status === "Approved" && applicantEmail) {
        // Call the mailer WITHOUT awaiting it in the main thread
        sendTicketEmail(applicantEmail, applicantName, tableChoice)
          .then(async (emailSentSuccessfully) => {
            const mailStatusText = emailSentSuccessfully ? "Sent" : "Failed";
            const cellRange = `'Form Responses 1'!${getColumnLetter(emailStatusColIndex)}${rowIndex}`;

            // Make a secondary, quiet API call to update just the Email Status cell
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: cellRange,
              valueInputOption: "USER_ENTERED",
              resource: {
                values: [[mailStatusText]],
              },
            });

            console.log(
              `Background update: Row ${rowIndex} Email Status set to '${mailStatusText}'`,
            );
          })
          .catch((err) =>
            console.error("Background email tracking failed:", err),
          );
      }
    } catch (error) {
      console.error("Google Sheets update error:", error);
      // Only send an error response if we haven't already sent a success response
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Failed to update status in Google Sheets." });
      }
    }
  },
);

router.get("/receipt/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // STEP 1: Ask Google Drive for the file's metadata (specifically the MIME type)
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: "mimeType, name",
    });

    const actualMimeType = metadata.data.mimeType;

    // STEP 2: Fetch the actual file stream
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" },
    );

    // STEP 3: Tell the browser EXACTLY what this file is so it renders inline
    res.setHeader("Content-Type", actualMimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${metadata.data.name}"`,
    );

    // STEP 4: Pipe the data directly to the client
    response.data
      .on("error", (err) => {
        console.error("Error streaming file:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming file.");
        }
      })
      .pipe(res);
  } catch (error) {
    console.error("Google Drive proxy error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch receipt from Google Drive." });
  }
});

// --- RESEND EMAIL (Protected by Type) ---
router.post(
  "/:type/resend",
  verifyToken,
  requireDynamicTypeAccess,
  async (req, res) => {
    try {
      const { type } = req.params;
      const { rowIndex, applicantEmail, applicantName, tableChoice } = req.body;

      if (!rowIndex || !applicantEmail) {
        return res
          .status(400)
          .json({ error: "Missing required data to resend email." });
      }

      let spreadsheetId =
        type === "dinner"
          ? process.env.SHEET_ID_DINNER
          : process.env.SHEET_ID_MERCH;

      // 1. Await the email generation and sending process
      const emailSentSuccessfully = await sendTicketEmail(
        applicantEmail,
        applicantName,
        tableChoice,
      );
      const mailStatusText = emailSentSuccessfully ? "Sent" : "Failed";

      // 2. Fetch headers to locate the "Email Status" column
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "'Form Responses 1'!1:1",
      });

      const headers = headerResponse.data.values
        ? headerResponse.data.values[0]
        : [];
      let emailStatusColIndex = headers.findIndex(
        (h) => h.trim().toLowerCase() === "email status",
      );

      // 3. Update the sheet
      if (emailStatusColIndex !== -1) {
        const cellRange = `'Form Responses 1'!${getColumnLetter(emailStatusColIndex)}${rowIndex}`;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: cellRange,
          valueInputOption: "USER_ENTERED",
          resource: { values: [[mailStatusText]] },
        });
      }

      // 4. Return the result to the frontend
      if (emailSentSuccessfully) {
        res
          .status(200)
          .json({ message: "Email resent successfully", status: "Sent" });
      } else {
        res
          .status(500)
          .json({ error: "Failed to send email", status: "Failed" });
      }
    } catch (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: "Server error while resending." });
    }
  },
);

module.exports = router;
