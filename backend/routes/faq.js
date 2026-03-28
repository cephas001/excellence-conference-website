const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const {
  stripUndefined,
  toTrimmedString,
  isNonEmptyString,
} = require("../utils/helpers");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("faq").orderBy("order", "asc").get();
    const faqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

router.post("/", async (req, res) => {
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
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

router.put("/:id", async (req, res) => {
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
    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("faq").doc(id).delete();
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

module.exports = router;
