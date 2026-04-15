// composables/useReviewUtils.js
export const useReviewUtils = () => {
  const formatName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatus = (row) => {
    if (!row) return "pending";
    const statusKey = Object.keys(row).find(
      (k) => k.toLowerCase() === "status",
    );
    return statusKey
      ? (row[statusKey] || "Pending").trim().toLowerCase()
      : "pending";
  };

  const getComment = (row) => {
    if (!row) return null;
    const commentKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("comment"),
    );
    return commentKey ? row[commentKey] : null;
  };

  const getReceiptKey = (applications) => {
    if (!applications || applications.length === 0) return null;
    return Object.keys(applications[0]).find(
      (k) =>
        k.toLowerCase().includes("receipt") ||
        k.toLowerCase().includes("proof") ||
        k.toLowerCase().includes("upload") ||
        k.toLowerCase().includes("payment"),
    );
  };

  const extractFileId = (url) => {
    if (!url || typeof url !== "string") return null;
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD) return matchD[1];
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId) return matchId[1];
    return null;
  };

  const formatHeader = (header) => {
    if (!header) return "";
    const lowerHeader = header.toLowerCase().trim();

    // Intercept the specific long table question
    if (lowerHeader.includes("what table would you love to sit at")) {
      return "Table Choice";
    }

    return header;
  };

  // Add this near your other functions
  const normalizeForWhatsApp = (phone) => {
    if (!phone) return "";

    // Convert to string and strip all non-numeric characters (spaces, dashes, plus signs)
    let cleaned = String(phone).replace(/\D/g, "");

    // If it starts with 0 and is 11 digits long (Standard Nigerian format: 0703...)
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      return "234" + cleaned.substring(1);
    }

    // If it's a 10 digit number (often OPay/Moniepoint accounts, e.g., 703...)
    if (cleaned.length === 10) {
      return "234" + cleaned;
    }

    // If it already starts with 234 and is 13 digits, it's perfect
    if (cleaned.startsWith("234") && cleaned.length === 13) {
      return cleaned;
    }

    return cleaned; // Fallback to raw cleaned numbers for weird edge cases
  };

  const getWhatsAppLink = (phone) => {
    const normalized = normalizeForWhatsApp(phone);
    return normalized ? `https://wa.me/${normalized}` : "#";
  };

  const getActualReceiptValue = (row) => {
    if (!row) return null;

    console.log(row);
    // Find all keys that contain 'receipt' (e.g., 'Receipt', 'Receipt 1')
    const receiptKeys = Object.keys(row).filter((k) =>
      k.toLowerCase().includes("receipt"),
    );

    // Return the first one that actually has a file link
    for (const key of receiptKeys) {
      if (row[key] && row[key].toString().trim() !== "") {
        return row[key];
      }
    }
    return null;
  };

  return {
    formatName,
    getStatus,
    getComment,
    getReceiptKey,
    extractFileId,
    formatHeader,
    getWhatsAppLink,
    normalizeForWhatsApp,
    getActualReceiptValue,
  };
};
