// backend/routes/auth.js
const express = require("express");
const { db, auth } = require("../config/firebase");
const { verifyToken, requireSuperAdmin } = require("../middleware/auth");

const router = express.Router();

// --- REGISTER ROUTE (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
router.post("/register", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role = "admin", type = "dinner" } = req.body;

    // 1. Create the user in Firebase Authentication
    // Firebase automatically checks for duplicate emails and hashes the password safely!
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Inside your /register route...
    await auth.setCustomUserClaims(userRecord.uid, { role: role });

    // 2. Save the extra metadata in Firestore ('reviewers' collection)
    // We use the Firebase Auth UID (userRecord.uid) as the document ID.
    // This perfectly links their Auth account to their database record.
    const userData = {
      name,
      email,
      role,
      type,
      createdAt: new Date().toISOString(),
    };

    await db.collection("reviewers").doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "Reviewer registered successfully",
      user: { id: userRecord.uid, ...userData },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Catch the specific Firebase error for duplicate emails
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ error: "Reviewer with this email already exists." });
    }
    res.status(500).json({
      error: error?.errorInfo?.message || "Server error during registration.",
    });
  }
});

// --- LOGIN ROUTE ---
// Note: The frontend logs the user in directly via Firebase.
// This route is now just for the frontend to send its token and fetch its role/type.
router.post("/login", verifyToken, async (req, res) => {
  try {
    // Thanks to your verifyToken middleware, req.user already contains the decoded Firebase token!
    const uid = req.user.uid;

    // Fetch the extra user data (role, type) from the Firestore 'reviewers' collection
    const userDoc = await db.collection("reviewers").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ error: "User profile not found in database." });
    }

    const userData = userDoc.data();

    // We no longer mint our own token, we just return the user data needed for frontend state
    res.status(200).json({
      message: "User data synced successfully",
      user: {
        id: uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        type: userData.type,
      },
    });
  } catch (error) {
    console.error("Login sync error:", error);
    res.status(500).json({ error: "Server error during login sync." });
  }
});

module.exports = router;
