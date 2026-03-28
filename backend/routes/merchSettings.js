const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const { stripUndefined, toTrimmedString } = require("../utils/helpers");

const MERCH_SETTINGS_ID = "config";

router.get("/", async (req, res) => {
  try {
    const docRef = await db
      .collection("merchSettings")
      .doc(MERCH_SETTINGS_ID)
      .get();
    if (!docRef.exists)
      return res.status(404).json({ error: "Merch settings not found" });
    res.status(200).json({ id: docRef.id, ...docRef.data() });
  } catch (error) {
    console.error("Error fetching merch settings:", error);
    res.status(500).json({ error: "Failed to fetch merch settings" });
  }
});

router.post("/", async (req, res) => {
  try {
    const payload = stripUndefined({
      accountNumber: toTrimmedString(req.body?.accountNumber) || null,
      accountName: toTrimmedString(req.body?.accountName) || null,
      accountBank: toTrimmedString(req.body?.accountBank) || null,
      googleFormLink: toTrimmedString(req.body?.googleFormLink) || null,
    });

    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).set(payload);
    res.status(201).json({ id: MERCH_SETTINGS_ID, ...payload });
  } catch (error) {
    console.error("Error creating merch settings:", error);
    res.status(500).json({ error: "Failed to create merch settings" });
  }
});

router.put("/", async (req, res) => {
  try {
    const payload = stripUndefined({
      accountNumber: toTrimmedString(req.body?.accountNumber) || null,
      accountName: toTrimmedString(req.body?.accountName) || null,
      accountBank: toTrimmedString(req.body?.accountBank) || null,
      googleFormLink: toTrimmedString(req.body?.googleFormLink) || null,
    });

    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).set(payload);
    res.status(200).json({ id: MERCH_SETTINGS_ID, ...payload });
  } catch (error) {
    console.error("Error updating merch settings:", error);
    res.status(500).json({ error: "Failed to update merch settings" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).delete();
    res.status(200).json({ success: true, id: MERCH_SETTINGS_ID });
  } catch (error) {
    console.error("Error deleting merch settings:", error);
    res.status(500).json({ error: "Failed to delete merch settings" });
  }
});

module.exports = router;
