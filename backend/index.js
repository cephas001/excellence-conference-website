const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
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
// ADMIN MUTATION ROUTES
// ==========================================

const MERCH_SETTINGS_ID = "config";
const EVENT_SETTINGS_COLLECTION = "eventSettings";
const EVENT_SETTINGS_DOC_IDS = {
  dinner: "dinner",
  venue: "venue",
  announcement: "current",
  contact: "contact",
};

function stripUndefined(obj) {
  if (obj === undefined || obj === null) return obj;
  if (Array.isArray(obj)) {
    return obj
      .map((value) => stripUndefined(value))
      .filter((value) => value !== undefined);
  }
  if (typeof obj !== "object") return obj;

  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const cleaned = stripUndefined(value);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

function parseIndex(indexValue) {
  const parsed = Number.parseInt(indexValue, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toTrimmedString(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function parseAnnouncementEndTime(input) {
  if (input == null || input === "") return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return admin.firestore.Timestamp.fromDate(date);
}

function buildAgendaItemPayload(body) {
  const type = body?.type === "detailed" ? "detailed" : "simple";
  const item = {
    time: toTrimmedString(body?.time),
    title: toTrimmedString(body?.title),
    description: toTrimmedString(body?.description) || undefined,
    type,
    tag:
      type === "detailed" ? toTrimmedString(body?.tag) || undefined : undefined,
  };

  if (type === "detailed") {
    item.speaker = {
      name: toTrimmedString(body?.speaker?.name),
      role: toTrimmedString(body?.speaker?.role),
      image: toTrimmedString(body?.speaker?.image),
    };
  }

  return stripUndefined(item);
}

async function getAgendaDayById(dayId) {
  const ref = db.collection("agendaDays").doc(dayId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { ref, data: snap.data() || {} };
}

// 8. Mutate Speakers
app.post("/api/speakers", async (req, res) => {
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
    return res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating speaker:", error);
    return res.status(500).json({ error: "Failed to create speaker" });
  }
});

app.put("/api/speakers/:id", async (req, res) => {
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
    return res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating speaker:", error);
    return res.status(500).json({ error: "Failed to update speaker" });
  }
});

app.delete("/api/speakers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("speakers").doc(id).delete();
    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    return res.status(500).json({ error: "Failed to delete speaker" });
  }
});

// 9. Mutate Testimonies
app.post("/api/testimonies", async (req, res) => {
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
    return res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating testimony:", error);
    return res.status(500).json({ error: "Failed to create testimony" });
  }
});

app.put("/api/testimonies/:id", async (req, res) => {
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
    return res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating testimony:", error);
    return res.status(500).json({ error: "Failed to update testimony" });
  }
});

app.delete("/api/testimonies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("testimonies").doc(id).delete();
    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting testimony:", error);
    return res.status(500).json({ error: "Failed to delete testimony" });
  }
});

// 10. Mutate Agenda Days
app.post("/api/agenda", async (req, res) => {
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
    return res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating agenda day:", error);
    return res.status(500).json({ error: "Failed to create agenda day" });
  }
});

app.put("/api/agenda/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingRef = db.collection("agendaDays").doc(id);
    const existingSnap = await existingRef.get();
    if (!existingSnap.exists) {
      return res.status(404).json({ error: "Agenda day not found" });
    }
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
    return res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating agenda day:", error);
    return res.status(500).json({ error: "Failed to update agenda day" });
  }
});

app.delete("/api/agenda/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("agendaDays").doc(id).delete();
    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting agenda day:", error);
    return res.status(500).json({ error: "Failed to delete agenda day" });
  }
});

// 11. Mutate Agenda Items (embedded in agenda day doc)
app.post("/api/agenda/:dayId/items", async (req, res) => {
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
    return res
      .status(201)
      .json({ dayId, index: currentItems.length - 1, item: newItem });
  } catch (error) {
    console.error("Error creating agenda item:", error);
    return res.status(500).json({ error: "Failed to create agenda item" });
  }
});

app.put("/api/agenda/:dayId/items/:itemIndex", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const itemIndex = parseIndex(req.params.itemIndex);
    if (itemIndex === null || itemIndex < 0) {
      return res
        .status(400)
        .json({ error: "itemIndex must be a non-negative integer" });
    }

    const day = await getAgendaDayById(dayId);
    if (!day) return res.status(404).json({ error: "Agenda day not found" });

    const currentItems = Array.isArray(day.data.items)
      ? [...day.data.items]
      : [];
    if (itemIndex >= currentItems.length) {
      return res.status(404).json({ error: "Agenda item not found" });
    }

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
    return res.status(200).json({ dayId, index: itemIndex, item });
  } catch (error) {
    console.error("Error updating agenda item:", error);
    return res.status(500).json({ error: "Failed to update agenda item" });
  }
});

app.delete("/api/agenda/:dayId/items/:itemIndex", async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const itemIndex = parseIndex(req.params.itemIndex);
    if (itemIndex === null || itemIndex < 0) {
      return res
        .status(400)
        .json({ error: "itemIndex must be a non-negative integer" });
    }

    const day = await getAgendaDayById(dayId);
    if (!day) return res.status(404).json({ error: "Agenda day not found" });

    const currentItems = Array.isArray(day.data.items)
      ? [...day.data.items]
      : [];
    if (itemIndex >= currentItems.length) {
      return res.status(404).json({ error: "Agenda item not found" });
    }

    currentItems.splice(itemIndex, 1);

    const payload = stripUndefined({
      label: day.data.label || "",
      sublabel: day.data.sublabel,
      date: day.data.date || "",
      order: day.data.order != null ? day.data.order : 0,
      items: currentItems,
    });

    await day.ref.set(payload);
    return res.status(200).json({ success: true, dayId, itemIndex });
  } catch (error) {
    console.error("Error deleting agenda item:", error);
    return res.status(500).json({ error: "Failed to delete agenda item" });
  }
});

// 12. Mutate Merch Items
app.post("/api/merch", async (req, res) => {
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
    return res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating merch item:", error);
    return res.status(500).json({ error: "Failed to create merch item" });
  }
});

app.put("/api/merch/:id", async (req, res) => {
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
    return res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating merch item:", error);
    return res.status(500).json({ error: "Failed to update merch item" });
  }
});

app.delete("/api/merch/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("merchItems").doc(id).delete();
    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting merch item:", error);
    return res.status(500).json({ error: "Failed to delete merch item" });
  }
});

// 13. Mutate Merch Settings (fixed doc: merchSettings/config)
app.post("/api/merch-settings", async (req, res) => {
  try {
    const payload = stripUndefined({
      accountNumber: toTrimmedString(req.body?.accountNumber) || null,
      accountName: toTrimmedString(req.body?.accountName) || null,
      accountBank: toTrimmedString(req.body?.accountBank) || null,
      googleFormLink: toTrimmedString(req.body?.googleFormLink) || null,
    });

    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).set(payload);
    return res.status(201).json({ id: MERCH_SETTINGS_ID, ...payload });
  } catch (error) {
    console.error("Error creating merch settings:", error);
    return res.status(500).json({ error: "Failed to create merch settings" });
  }
});

app.put("/api/merch-settings", async (req, res) => {
  try {
    const payload = stripUndefined({
      accountNumber: toTrimmedString(req.body?.accountNumber) || null,
      accountName: toTrimmedString(req.body?.accountName) || null,
      accountBank: toTrimmedString(req.body?.accountBank) || null,
      googleFormLink: toTrimmedString(req.body?.googleFormLink) || null,
    });

    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).set(payload);
    return res.status(200).json({ id: MERCH_SETTINGS_ID, ...payload });
  } catch (error) {
    console.error("Error updating merch settings:", error);
    return res.status(500).json({ error: "Failed to update merch settings" });
  }
});

app.delete("/api/merch-settings", async (req, res) => {
  try {
    await db.collection("merchSettings").doc(MERCH_SETTINGS_ID).delete();
    return res.status(200).json({ success: true, id: MERCH_SETTINGS_ID });
  } catch (error) {
    console.error("Error deleting merch settings:", error);
    return res.status(500).json({ error: "Failed to delete merch settings" });
  }
});

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
    if (body?.endTime && !parsedEndTime) {
      return { __invalidEndTime: true };
    }
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

function registerEventSettingsRoute(method, section) {
  const docId = EVENT_SETTINGS_DOC_IDS[section];
  const path = `/api/event-settings/${section}`;

  app[method](path, async (req, res) => {
    try {
      const payload = buildEventSettingsPayload(section, req.body);
      if (!payload)
        return res
          .status(400)
          .json({ error: "Invalid event settings section" });
      if (payload.__invalidEndTime) {
        return res.status(400).json({ error: "Invalid endTime format" });
      }

      await db.collection(EVENT_SETTINGS_COLLECTION).doc(docId).set(payload);
      const statusCode = method === "post" ? 201 : 200;
      return res.status(statusCode).json({ id: docId, ...payload });
    } catch (error) {
      console.error(`Error mutating event settings (${section}):`, error);
      return res
        .status(500)
        .json({ error: `Failed to mutate event settings (${section})` });
    }
  });

  app.delete(path, async (req, res) => {
    try {
      await db.collection(EVENT_SETTINGS_COLLECTION).doc(docId).delete();
      return res.status(200).json({ success: true, id: docId });
    } catch (error) {
      console.error(`Error deleting event settings (${section}):`, error);
      return res
        .status(500)
        .json({ error: `Failed to delete event settings (${section})` });
    }
  });
}

// 14. Mutate Event Settings (fixed docs)
registerEventSettingsRoute("post", "dinner");
registerEventSettingsRoute("put", "dinner");
registerEventSettingsRoute("post", "venue");
registerEventSettingsRoute("put", "venue");
registerEventSettingsRoute("post", "announcement");
registerEventSettingsRoute("put", "announcement");
registerEventSettingsRoute("post", "contact");
registerEventSettingsRoute("put", "contact");

// 15. Mutate FAQ
app.post("/api/faq", async (req, res) => {
  try {
    const orderSnapshot = await db.collection("faq").get();
    const payload = stripUndefined({
      question: toTrimmedString(req.body?.question),
      answer: toTrimmedString(req.body?.answer),
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || orderSnapshot.size,
    });

    if (
      !isNonEmptyString(payload.question) ||
      !isNonEmptyString(payload.answer)
    ) {
      return res
        .status(400)
        .json({ error: "question and answer are required" });
    }

    const created = await db.collection("faq").add(payload);
    return res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return res.status(500).json({ error: "Failed to create FAQ" });
  }
});

app.put("/api/faq/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingSnap = await db.collection("faq").doc(id).get();
    const fallbackOrder = existingSnap.exists ? existingSnap.data()?.order : 0;
    const payload = stripUndefined({
      question: toTrimmedString(req.body?.question),
      answer: toTrimmedString(req.body?.answer),
      order: Number.isFinite(req.body?.order)
        ? req.body.order
        : Number.parseInt(req.body?.order, 10) || fallbackOrder || 0,
    });

    if (
      !isNonEmptyString(payload.question) ||
      !isNonEmptyString(payload.answer)
    ) {
      return res
        .status(400)
        .json({ error: "question and answer are required" });
    }

    await db.collection("faq").doc(id).set(payload);
    return res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return res.status(500).json({ error: "Failed to update FAQ" });
  }
});

app.delete("/api/faq/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("faq").doc(id).delete();
    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Excellence Conference API running on port ${PORT}`);
});
