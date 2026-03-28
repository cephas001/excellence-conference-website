const admin = require("firebase-admin");

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

module.exports = {
  stripUndefined,
  parseIndex,
  isNonEmptyString,
  toTrimmedString,
  parseAnnouncementEndTime,
  buildAgendaItemPayload,
};
