const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const {
  stripUndefined,
  toTrimmedString,
  isNonEmptyString,
} = require("../utils/helpers");

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      role: toTrimmedString(req.body?.role),
      bio: toTrimmedString(req.body?.bio),
      topic: toTrimmedString(req.body?.topic),
      image: toTrimmedString(req.body?.image) || "/img/speaker1.jpg",
    });

    if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.role)) {
      return res.status(400).json({ error: "name and role are required" });
    }

    const created = await db.collection("speakers").add(payload);
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating speaker:", error);
    res.status(500).json({ error: "Failed to create speaker" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      role: toTrimmedString(req.body?.role),
      bio: toTrimmedString(req.body?.bio),
      topic: toTrimmedString(req.body?.topic),
      image: toTrimmedString(req.body?.image) || "/img/speaker1.jpg",
    });

    if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.role)) {
      return res.status(400).json({ error: "name and role are required" });
    }

    await db.collection("speakers").doc(id).set(payload);
    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating speaker:", error);
    res.status(500).json({ error: "Failed to update speaker" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("speakers").doc(id).delete();
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    res.status(500).json({ error: "Failed to delete speaker" });
  }
});

module.exports = router;
