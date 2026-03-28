const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const {
  stripUndefined,
  toTrimmedString,
  isNonEmptyString,
  parseIndex,
  buildAgendaItemPayload,
} = require("../utils/helpers");

async function getAgendaDayById(dayId) {
  const ref = db.collection("agendaDays").doc(dayId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { ref, data: snap.data() || {} };
}

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const payload = stripUndefined({
      label: toTrimmedString(req.body?.label),
      sublabel: toTrimmedString(req.body?.sublabel) || undefined,
      date: toTrimmedString(req.body?.date),
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || 0,
      items: Array.isArray(req.body?.items) ? req.body.items : [],
    });

    if (!isNonEmptyString(payload.label) || !isNonEmptyString(payload.date)) {
      return res.status(400).json({ error: "label and date are required" });
    }

    const created = await db.collection("agendaDays").add(payload);
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating agenda day:", error);
    res.status(500).json({ error: "Failed to create agenda day" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingRef = db.collection("agendaDays").doc(id);
    const existingSnap = await existingRef.get();
    if (!existingSnap.exists)
      return res.status(404).json({ error: "Agenda day not found" });
    const existing = existingSnap.data() || {};

    const payload = stripUndefined({
      label: toTrimmedString(req.body?.label),
      sublabel: toTrimmedString(req.body?.sublabel) || undefined,
      date: toTrimmedString(req.body?.date),
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || 0,
      items: Array.isArray(req.body?.items)
        ? req.body.items
        : Array.isArray(existing.items)
          ? existing.items
          : [],
    });

    if (!isNonEmptyString(payload.label) || !isNonEmptyString(payload.date)) {
      return res.status(400).json({ error: "label and date are required" });
    }

    await existingRef.set(payload);
    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating agenda day:", error);
    res.status(500).json({ error: "Failed to update agenda day" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("agendaDays").doc(id).delete();
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting agenda day:", error);
    res.status(500).json({ error: "Failed to delete agenda day" });
  }
});

// --- Agenda Items Sub-Routes ---
router.post("/:dayId/items", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const day = await getAgendaDayById(dayId);
    if (!day) return res.status(404).json({ error: "Agenda day not found" });

    const newItem = buildAgendaItemPayload(req.body);
    if (!isNonEmptyString(newItem.time) || !isNonEmptyString(newItem.title)) {
      return res.status(400).json({ error: "time and title are required" });
    }

    const currentItems = Array.isArray(day.data.items)
      ? [...day.data.items]
      : [];
    currentItems.push(newItem);

    const payload = stripUndefined({
      label: day.data.label || "",
      sublabel: day.data.sublabel,
      date: day.data.date || "",
      order: day.data.order != null ? day.data.order : 0,
      items: currentItems,
    });

    await day.ref.set(payload);
    res
      .status(201)
      .json({ dayId, index: currentItems.length - 1, item: newItem });
  } catch (error) {
    console.error("Error creating agenda item:", error);
    res.status(500).json({ error: "Failed to create agenda item" });
  }
});

router.put("/:dayId/items/:itemIndex", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const itemIndex = parseIndex(req.params.itemIndex);
    if (itemIndex === null || itemIndex < 0)
      return res
        .status(400)
        .json({ error: "itemIndex must be a non-negative integer" });

    const day = await getAgendaDayById(dayId);
    if (!day) return res.status(404).json({ error: "Agenda day not found" });

    const currentItems = Array.isArray(day.data.items)
      ? [...day.data.items]
      : [];
    if (itemIndex >= currentItems.length)
      return res.status(404).json({ error: "Agenda item not found" });

    const item = buildAgendaItemPayload(req.body);
    if (!isNonEmptyString(item.time) || !isNonEmptyString(item.title)) {
      return res.status(400).json({ error: "time and title are required" });
    }
    currentItems[itemIndex] = item;

    const payload = stripUndefined({
      label: day.data.label || "",
      sublabel: day.data.sublabel,
      date: day.data.date || "",
      order: day.data.order != null ? day.data.order : 0,
      items: currentItems,
    });

    await day.ref.set(payload);
    res.status(200).json({ dayId, index: itemIndex, item });
  } catch (error) {
    console.error("Error updating agenda item:", error);
    res.status(500).json({ error: "Failed to update agenda item" });
  }
});

router.delete("/:dayId/items/:itemIndex", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const itemIndex = parseIndex(req.params.itemIndex);
    if (itemIndex === null || itemIndex < 0)
      return res
        .status(400)
        .json({ error: "itemIndex must be a non-negative integer" });

    const day = await getAgendaDayById(dayId);
    if (!day) return res.status(404).json({ error: "Agenda day not found" });

    const currentItems = Array.isArray(day.data.items)
      ? [...day.data.items]
      : [];
    if (itemIndex >= currentItems.length)
      return res.status(404).json({ error: "Agenda item not found" });

    currentItems.splice(itemIndex, 1);

    const payload = stripUndefined({
      label: day.data.label || "",
      sublabel: day.data.sublabel,
      date: day.data.date || "",
      order: day.data.order != null ? day.data.order : 0,
      items: currentItems,
    });

    await day.ref.set(payload);
    res.status(200).json({ success: true, dayId, itemIndex });
  } catch (error) {
    console.error("Error deleting agenda item:", error);
    res.status(500).json({ error: "Failed to delete agenda item" });
  }
});

module.exports = router;
