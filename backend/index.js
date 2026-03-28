const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { db } = require("./firebase");

const app = express();

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

// 1. Get Speakers
app.get("/api/speakers", async (req, res) => {
  try {
    const snapshot = await db.collection("speakers").get();
    const speakers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(speakers);
  } catch (error) {
    console.error("Error fetching speakers:", error);
    res.status(500).json({ error: "Failed to fetch speakers" });
  }
});

// 2. Get Testimonies
app.get("/api/testimonies", async (req, res) => {
  try {
    const snapshot = await db.collection("testimonies").get();
    const testimonies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(testimonies);
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    res.status(500).json({ error: "Failed to fetch testimonies" });
  }
});

// 3. Get Agenda Days (Sorted by 'order')
app.get("/api/agenda", async (req, res) => {
  try {
    const snapshot = await db
      .collection("agendaDays")
      .orderBy("order", "asc")
      .get();
    const agendaDays = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(agendaDays);
  } catch (error) {
    console.error("Error fetching agenda:", error);
    res.status(500).json({ error: "Failed to fetch agenda" });
  }
});

// 4. Get Merch Catalog (Sorted by 'order')
app.get("/api/merch", async (req, res) => {
  try {
    const snapshot = await db
      .collection("merchItems")
      .orderBy("order", "asc")
      .get();
    const merchItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(merchItems);
  } catch (error) {
    console.error("Error fetching merch items:", error);
    res.status(500).json({ error: "Failed to fetch merch items" });
  }
});

// 5. Get Merch Settings (Payment Config)
app.get("/api/merch-settings", async (req, res) => {
  try {
    const docRef = await db.collection("merchSettings").doc("config").get();
    if (!docRef.exists) {
      return res.status(404).json({ error: "Merch settings not found" });
    }
    res.status(200).json({ id: docRef.id, ...docRef.data() });
  } catch (error) {
    console.error("Error fetching merch settings:", error);
    res.status(500).json({ error: "Failed to fetch merch settings" });
  }
});

// 6. Get Event Settings (Bundles Venue, Dinner, Announcements, Contact)
app.get("/api/event-settings", async (req, res) => {
  try {
    const snapshot = await db.collection("eventSettings").get();
    const settings = {};

    // This formats the response into a neat object: { dinner: {...}, venue: {...}, current: {...} }
    snapshot.forEach((doc) => {
      settings[doc.id] = doc.data();
    });

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching event settings:", error);
    res.status(500).json({ error: "Failed to fetch event settings" });
  }
});

// 7. Get FAQ (Sorted by 'order')
app.get("/api/faq", async (req, res) => {
  try {
    const snapshot = await db.collection("faq").orderBy("order", "asc").get();
    const faqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Excellence Conference API running on port ${PORT}`);
});
