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

router.post("/", async (req, res) => {
  try {
    const orderSnapshot = await db.collection("merchItems").get();
    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      price: toTrimmedString(req.body?.price),
      description: toTrimmedString(req.body?.description) || undefined,
      images: Array.isArray(req.body?.images)
        ? req.body.images.map((value) => toTrimmedString(value)).filter(Boolean)
        : undefined,
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || orderSnapshot.size,
    });

    if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.price)) {
      return res.status(400).json({ error: "name and price are required" });
    }

    const created = await db.collection("merchItems").add(payload);
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating merch item:", error);
    res.status(500).json({ error: "Failed to create merch item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingSnap = await db.collection("merchItems").doc(id).get();
    const fallbackOrder = existingSnap.exists ? existingSnap.data()?.order : 0;

    const payload = stripUndefined({
      name: toTrimmedString(req.body?.name),
      price: toTrimmedString(req.body?.price),
      description: toTrimmedString(req.body?.description) || undefined,
      images: Array.isArray(req.body?.images)
        ? req.body.images.map((value) => toTrimmedString(value)).filter(Boolean)
        : undefined,
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || fallbackOrder || 0,
    });

    if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.price)) {
      return res.status(400).json({ error: "name and price are required" });
    }

    await db.collection("merchItems").doc(id).set(payload);
    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating merch item:", error);
    res.status(500).json({ error: "Failed to update merch item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("merchItems").doc(id).delete();
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting merch item:", error);
    res.status(500).json({ error: "Failed to delete merch item" });
  }
});

module.exports = router;
