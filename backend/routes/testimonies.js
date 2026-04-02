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

router.post("/", async (req, res) => {
  try {
    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      location: toTrimmedString(req.body?.location),
      testimony: toTrimmedString(req.body?.testimony),
    });

    if (
      !isNonEmptyString(payload.name) ||
      !isNonEmptyString(payload.testimony)
    ) {
      return res.status(400).json({ error: "name and testimony are required" });
    }

    const created = await db.collection("testimonies").add(payload);
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating testimony:", error);
    res.status(500).json({ error: "Failed to create testimony" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      location: toTrimmedString(req.body?.location),
      testimony: toTrimmedString(req.body?.testimony),
    });

    if (
      !isNonEmptyString(payload.name) ||
      !isNonEmptyString(payload.testimony)
    ) {
      return res.status(400).json({ error: "name and testimony are required" });
    }

    await db.collection("testimonies").doc(id).set(payload);
    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating testimony:", error);
    res.status(500).json({ error: "Failed to update testimony" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("testimonies").doc(id).delete();
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting testimony:", error);
    res.status(500).json({ error: "Failed to delete testimony" });
  }
});

module.exports = router;
