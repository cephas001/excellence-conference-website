const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const {
  stripUndefined,
  toTrimmedString,
  parseAnnouncementEndTime,
} = require("../utils/helpers");

const EVENT_SETTINGS_COLLECTION = "eventSettings";
const EVENT_SETTINGS_DOC_IDS = {
  dinner: "dinner",
  venue: "venue",
  announcement: "current",
  contact: "contact",
};

function buildEventSettingsPayload(section, body) {
  if (section === "dinner") {
    return stripUndefined({
      venueName: toTrimmedString(body?.venueName) || null,
      venueAddress: toTrimmedString(body?.venueAddress) || null,
      date: toTrimmedString(body?.date) || null,
      time: toTrimmedString(body?.time) || null,
      description: toTrimmedString(body?.description) || null,
      mapLink: toTrimmedString(body?.mapLink) || null,
    });
  }

  if (section === "venue") {
    return stripUndefined({
      venueName: toTrimmedString(body?.venueName) || null,
      address: toTrimmedString(body?.address) || null,
      mapLink: toTrimmedString(body?.mapLink) || null,
    });
  }

  if (section === "announcement") {
    const parsedEndTime = parseAnnouncementEndTime(body?.endTime);
    if (body?.endTime && !parsedEndTime) return { __invalidEndTime: true };
    return stripUndefined({
      message: toTrimmedString(body?.message) || null,
      endTime: parsedEndTime,
    });
  }

  if (section === "contact") {
    return stripUndefined({
      email: toTrimmedString(body?.email) || null,
      phone: toTrimmedString(body?.phone) || null,
    });
  }

  return null;
}

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection(EVENT_SETTINGS_COLLECTION).get();
    const settings = {};
    snapshot.forEach((doc) => {
      settings[doc.id] = doc.data();
    });
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching event settings:", error);
    res.status(500).json({ error: "Failed to fetch event settings" });
  }
});

// Dynamic routing for the sections
["dinner", "venue", "announcement", "contact"].forEach((section) => {
  const docId = EVENT_SETTINGS_DOC_IDS[section];
  const handleMutation = async (req, res, method) => {
    try {
      const payload = buildEventSettingsPayload(section, req.body);
      if (!payload)
        return res
          .status(400)
          .json({ error: "Invalid event settings section" });
      if (payload.__invalidEndTime)
        return res.status(400).json({ error: "Invalid endTime format" });

      await db.collection(EVENT_SETTINGS_COLLECTION).doc(docId).set(payload);
      const statusCode = method === "post" ? 201 : 200;
      res.status(statusCode).json({ id: docId, ...payload });
    } catch (error) {
      console.error(`Error mutating event settings (${section}):`, error);
      res
        .status(500)
        .json({ error: `Failed to mutate event settings (${section})` });
    }
  };

  router.post(`/${section}`, (req, res) => handleMutation(req, res, "post"));
  router.put(`/${section}`, (req, res) => handleMutation(req, res, "put"));

  router.delete(`/${section}`, async (req, res) => {
    try {
      await db.collection(EVENT_SETTINGS_COLLECTION).doc(docId).delete();
      res.status(200).json({ success: true, id: docId });
    } catch (error) {
      console.error(`Error deleting event settings (${section}):`, error);
      res
        .status(500)
        .json({ error: `Failed to delete event settings (${section})` });
    }
  });
});

module.exports = router;
