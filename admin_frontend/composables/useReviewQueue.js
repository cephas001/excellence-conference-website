import { ref, computed, watch } from "vue";
import { useRuntimeConfig, useCookie } from "#app";
import { useReviewUtils } from "~/composables/useReviewUtils";
import { useAuthStore } from "~/stores/auth";
import Fuse from "fuse.js";
import { useAlertModal } from "~/composables/useAlertModal";

export const useReviewQueue = (endpoint, options = {}) => {
  const config = useRuntimeConfig();
  const token = useCookie("ec_token");
  const {
    formatName,
    getStatus,
    getReceiptKey,
    extractFileId,
    getActualReceiptValue,
    getCheckoutStatus,
  } = useReviewUtils();
  const { hiddenColumns = [] } = options; // Destructure the hidden columns, default to empty
  const { showAlert } = useAlertModal();

  // --- Shared State ---
  const applications = ref([]);
  const loading = ref(true);
  const updatingRow = ref(null);
  const currentTab = ref("review");
  const imageLoadError = ref(false);
  const currentIndex = ref(0);
  const reviewComment = ref("");
  const showInfoPanel = ref(false);
  const isModalOpen = ref(false);
  const selectedRow = ref(null);
  const resendingRows = ref([]); // Specifically used by Dinner
  const searchQuery = ref("");

  // --- Navigation ---
  const nextApp = () => {
    if (currentIndex.value < pendingApplications.value.length - 1) {
      currentIndex.value++;
      reviewComment.value = "";
    }
  };

  const prevApp = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      reviewComment.value = "";
    }
  };

  const openDetailsModal = (row) => {
    selectedRow.value = row;
    isModalOpen.value = true;
  };

  // --- Computed Lists ---
  const fuse = computed(() => {
    if (applications.value.length === 0) return null;

    // Dynamically grab all columns, ignoring internal keys AND the hidden Reviewer column
    const searchableKeys = Object.keys(applications.value[0]).filter(
      (k) => !k.startsWith("_") && k.toLowerCase() !== "reviewer",
    );

    return new Fuse(applications.value, {
      keys: searchableKeys,
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  });

  const filteredApplications = computed(() => {
    if (!searchQuery.value.trim() || !fuse.value) {
      return applications.value;
    }

    // Fuse returns an array of { item, refIndex } objects, so we map it back to just the items
    const results = fuse.value.search(searchQuery.value);
    return results.map((result) => result.item);
  });

  const pendingApplications = computed(() =>
    filteredApplications.value.filter((app) => {
      const status = getStatus(app);
      return status !== "approved" && status !== "rejected";
    }),
  );

  const currentApp = computed(() => {
    if (pendingApplications.value.length === 0) return null;

    const safeIndex = Math.min(
      currentIndex.value,
      pendingApplications.value.length - 1,
    );

    return pendingApplications.value[safeIndex];
  });

  const approvedApplications = computed(() =>
    filteredApplications.value.filter((app) => {
      return getStatus(app) === "approved";
    }),
  );

  const undeliveredApplications = computed(() =>
    approvedApplications.value.filter((app) => {
      // 1. Delivery Check
      const deliveryStatus = getCheckoutStatus(app);
      let isUndelivered = true;

      if (deliveryStatus) {
        const normalizedStatus = deliveryStatus.toString().trim().toLowerCase();
        if (
          normalizedStatus === "delivered" ||
          normalizedStatus === "true" ||
          normalizedStatus === "yes" ||
          normalizedStatus === "issue reported" // <-- ADD THIS LINE
        ) {
          isUndelivered = false; // It has been handled (either delivered or reported)
        }
      }

      // 2. Batch Check
      const batchKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("batch"),
      );
      const batchValue = batchKey
        ? (app[batchKey] || "").toString().trim().toLowerCase()
        : "";

      const isReadyForPickup =
        !batchValue.includes("batch 2") && !batchValue.includes("pending");

      return isUndelivered && isReadyForPickup;
    }),
  );

  const deliveredApplications = computed(() =>
    // Step 1: ONLY look at applications that are already Approved
    approvedApplications.value.filter((app) => {
      // Step 2: Get the current delivery status
      const deliveryStatus = getCheckoutStatus(app);

      // Step 3: If it's blank, null, or undefined, it is definitely NOT delivered
      if (!deliveryStatus) return false;

      // Step 4: Normalize the text to catch variations
      const normalizedStatus = deliveryStatus.toString().trim().toLowerCase();

      // Return true (keep in the delivered list) ONLY if it has been explicitly marked
      return (
        normalizedStatus === "delivered" ||
        normalizedStatus === "true" ||
        normalizedStatus === "yes"
      );
    }),
  );

  const reportedApplications = computed(() =>
    approvedApplications.value.filter((app) => {
      const deliveryStatus = getCheckoutStatus(app);
      if (!deliveryStatus) return false;

      const normalizedStatus = deliveryStatus.toString().trim().toLowerCase();

      // Match the exact string emitted by your "Report Issue" button
      return normalizedStatus === "issue reported";
    }),
  );

  const rejectedApplications = computed(() =>
    filteredApplications.value.filter((app) => getStatus(app) === "rejected"),
  );

  watch(searchQuery, () => {
    currentIndex.value = 0;
  });

  // Dinner-specific computed (safely returns empty if not applicable)
  const unsentApplications = computed(() =>
    approvedApplications.value.filter((app) => {
      const emailStatusKey = Object.keys(app).find(
        (k) => k.toLowerCase() === "email status",
      );
      const eStatus = emailStatusKey
        ? (app[emailStatusKey] || "").trim().toLowerCase()
        : "";
      return eStatus === "failed" || eStatus === "";
    }),
  );

  const activeSummaryList = computed(() => {
    if (currentTab.value === "approved") return approvedApplications.value;
    if (currentTab.value === "rejected") return rejectedApplications.value;
    if (currentTab.value === "unsent") return unsentApplications.value;
    return [];
  });

  const dataHeaders = computed(() => {
    if (applications.value.length === 0) return [];

    const lowerHidden = hiddenColumns.map((col) => col.toLowerCase().trim());

    return Object.keys(applications.value[0]).filter((key) => {
      const lowerKey = key.toLowerCase().trim();
      return (
        lowerKey !== "_rowindex" &&
        lowerKey !== "status" &&
        lowerKey !== "comment" &&
        lowerKey !== "comments" &&
        lowerKey !== "email status" &&
        !lowerKey.includes("receipt") && // <-- THIS hides all versions of the receipt column
        !lowerHidden.includes(lowerKey)
      );
    });
  });

  // --- Computed URLs ---
  const generateReceiptUrl = (row) => {
    if (!row) return null;

    // Use the smart extractor instead of relying on a single key
    const receiptValue = getActualReceiptValue(row);
    if (!receiptValue) return null;

    const fileId = extractFileId(receiptValue);
    return fileId
      ? `${config.public.apiBase}/applications/receipt/${fileId}`
      : null;
  };

  const currentReceiptUrl = computed(() =>
    imageLoadError.value ? null : generateReceiptUrl(currentApp.value),
  );
  const selectedReceiptUrl = computed(() =>
    generateReceiptUrl(selectedRow.value),
  );

  // --- API Methods ---
  const fetchApplications = async () => {
    loading.value = true;
    currentIndex.value = 0;
    try {
      const response = await $fetch(
        `${config.public.apiBase}/applications/${endpoint}`,
      );
      applications.value = response.data;
    } catch (err) {
      if (err.response?._handledGlobally) return;

      showAlert("Failed to load data.", "error");
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (rowIndex, newStatus) => {
    updatingRow.value = rowIndex;
    imageLoadError.value = false;

    const rowIndexInArray = applications.value.findIndex(
      (app) => app._rowIndex === rowIndex,
    );
    if (rowIndexInArray === -1) {
      updatingRow.value = null;
      return;
    }

    const app = applications.value[rowIndexInArray];

    // 1. Grab the reviewer's email from the Pinia store
    const authStore = useAuthStore();
    const reviewerEmail = authStore.user?.email || "Unknown Admin";

    // 2. Add reviewerEmail to the base body payload
    const body = {
      rowIndex,
      status: newStatus,
      comment: reviewComment.value,
      reviewerEmail,
    };

    // Dynamically inject Dinner-specific payload if we are on the dinner endpoint
    if (endpoint === "dinner") {
      const emailKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("email"),
      );
      const nameKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("name"),
      );
      const tableKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("table"),
      );

      body.applicantEmail = emailKey ? app[emailKey] : null;
      body.applicantName = nameKey ? formatName(app[nameKey]) : null;
      body.tableChoice = tableKey ? app[tableKey] : null;
    }

    try {
      await $fetch(`${config.public.apiBase}/applications/${endpoint}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.value}` },
        body,
      });

      // Find the correct keys dynamically in case of slight variations in the sheet
      let statusKey =
        Object.keys(app).find((k) => k.toLowerCase() === "status") || "Status";
      let commentKey =
        Object.keys(app).find(
          (k) =>
            k.toLowerCase() === "comment" || k.toLowerCase() === "comments",
        ) || "Comments";
      let reviewerKey =
        Object.keys(app).find((k) => k.toLowerCase() === "reviewer") ||
        "REVIEWER";

      // 3. Optimistically update the UI local state
      applications.value[rowIndexInArray][statusKey] = newStatus;
      applications.value[rowIndexInArray][commentKey] = reviewComment.value;
      applications.value[rowIndexInArray][reviewerKey] = reviewerEmail;

      reviewComment.value = "";
      if (currentIndex.value >= pendingApplications.value.length) {
        currentIndex.value = Math.max(0, pendingApplications.value.length - 1);
      }
    } catch (err) {
      if (err.response?._handledGlobally) return;

      showAlert(err.data?.error || "Failed to update status.", "error");
    } finally {
      updatingRow.value = null;
    }
  };

  const updateCheckoutStatus = async (rowIndex, newStatus) => {
    updatingRow.value = rowIndex;
    imageLoadError.value = false;

    const rowIndexInArray = applications.value.findIndex(
      (app) => app._rowIndex === rowIndex,
    );
    if (rowIndexInArray === -1) {
      updatingRow.value = null;
      return;
    }

    const app = applications.value[rowIndexInArray];

    // 1. Grab the reviewer's email from the Pinia store
    const authStore = useAuthStore();
    const reviewerEmail = authStore.user?.email || "Unknown Admin";

    // 2. Add reviewerEmail to the base body payload
    const body = {
      rowIndex,
      delivered: newStatus,
      comment: reviewComment.value,
      reviewerEmail,
    };

    try {
      await $fetch(
        `${config.public.apiBase}/applications/${endpoint}/checkout`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token.value}` },
          body,
        },
      );

      // Find the correct keys dynamically in case of slight variations in the sheet
      let statusKey =
        Object.keys(app).find((k) => k.toLowerCase() === "delivered") ||
        "Delivered";
      let commentKey =
        Object.keys(app).find(
          (k) =>
            k.toLowerCase() === "comment" || k.toLowerCase() === "comments",
        ) || "Comments";
      let reviewerKey =
        Object.keys(app).find((k) => k.toLowerCase() === "reviewer") ||
        "REVIEWER";

      // 3. Optimistically update the UI local state
      applications.value[rowIndexInArray][statusKey] = newStatus;
      applications.value[rowIndexInArray][commentKey] = reviewComment.value;
      applications.value[rowIndexInArray][reviewerKey] = reviewerEmail;

      reviewComment.value = "";

      // 4. Handle the array shrink!
      // Because undeliveredApplications filters out "Delivered" items instantly,
      // the array shrinks. We DO NOT increment the index. We just make sure
      // the index hasn't fallen off the end of the newly shrunken array.
      if (currentIndex.value >= undeliveredApplications.value.length) {
        currentIndex.value = Math.max(
          0,
          undeliveredApplications.value.length - 1,
        );
      }
    } catch (err) {
      if (err.response?._handledGlobally) return;

      showAlert(err.data?.error || "Failed to update status.", "error");
    } finally {
      updatingRow.value = null;
    }
  };

  const resendEmail = async (row) => {
    resendingRows.value.push(row._rowIndex);
    const emailKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("email"),
    );
    const nameKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("name"),
    );
    const tableKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("table"),
    );

    try {
      await $fetch(`${config.public.apiBase}/applications/dinner/resend`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: {
          rowIndex: row._rowIndex,
          applicantEmail: row[emailKey],
          applicantName: formatName(row[nameKey]),
          tableChoice: row[tableKey],
        },
      });

      let emailStatusKey =
        Object.keys(row).find((k) => k.toLowerCase() === "email status") ||
        "Email Status";
      row[emailStatusKey] = "Sent";
      showAlert("Success! Ticket has been emailed.", "success");
    } catch (err) {
      let emailStatusKey =
        Object.keys(row).find((k) => k.toLowerCase() === "email status") ||
        "Email Status";
      row[emailStatusKey] = "Failed";

      if (err.response?._handledGlobally) return;

      showAlert(err.data?.error || "Failed to send email.", "error");
    } finally {
      resendingRows.value = resendingRows.value.filter(
        (id) => id !== row._rowIndex,
      );
    }
  };

  // --- Checkout-Specific Navigation & State ---
  // Create a computed property specifically for the checkout queue
  const currentCheckoutApp = computed(() => {
    if (undeliveredApplications.value.length === 0) return null;
    const safeIndex = Math.min(
      currentIndex.value,
      undeliveredApplications.value.length - 1,
    );
    return undeliveredApplications.value[safeIndex];
  });

  const nextCheckoutApp = () => {
    if (currentIndex.value < undeliveredApplications.value.length - 1) {
      currentIndex.value++;
      reviewComment.value = "";
    }
  };

  const prevCheckoutApp = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      reviewComment.value = "";
    }
  };

  return {
    applications,
    filteredApplications,
    searchQuery,
    loading,
    updatingRow,
    currentTab,
    currentIndex,
    reviewComment,
    showInfoPanel,
    isModalOpen,
    selectedRow,
    resendingRows,
    pendingApplications,
    currentApp,
    approvedApplications,
    rejectedApplications,
    unsentApplications,
    activeSummaryList,
    dataHeaders,
    currentReceiptUrl,
    selectedReceiptUrl,
    nextApp,
    prevApp,
    openDetailsModal,
    fetchApplications,
    updateStatus,
    resendEmail,
    updateCheckoutStatus,
    undeliveredApplications,
    deliveredApplications,
    currentCheckoutApp,
    nextCheckoutApp,
    prevCheckoutApp,
    reportedApplications,
  };
};
