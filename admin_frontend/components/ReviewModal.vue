<template>
  <div
    v-if="isOpen && row"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-montserrat"
  >
    <div
      class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Shrink the modal if there is no image panel to display -->
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-all duration-300"
      :class="mode === 'checkout' ? 'max-w-2xl' : 'max-w-4xl'"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 z-10 text-gray-500"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Details Panel -->
      <div
        class="flex-1 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 border-gray-100 flex flex-col"
        :class="mode === 'checkout' ? '' : 'md:border-r'"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-6">
          {{ mode === "checkout" ? "Order Details" : "Review Details" }}
        </h3>

        <div class="space-y-4 flex-1">
          <div v-for="header in headers" :key="header">
            <span class="block text-xs font-semibold text-gray-400 uppercase">{{
              formatHeader(header)
            }}</span>
            <div class="flex items-center">
              <span class="block text-sm text-gray-900 font-medium">
                {{
                  header.toLowerCase().includes("name")
                    ? formatName(row[header])
                    : row[header] || "—"
                }}
              </span>

              <a
                v-if="
                  (header.toLowerCase().includes('phone') ||
                    header.toLowerCase().includes('whatsapp')) &&
                  row[header]
                "
                :href="getWhatsAppLink(row[header])"
                target="_blank"
                class="ml-2 text-green-500 hover:text-green-600 transition-transform bg-green-50 p-1 rounded-full"
                title="Chat on WhatsApp"
              >
                <IconsWhatsApp />
              </a>
            </div>
          </div>

          <div
            v-if="getComment(row)"
            class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
          >
            <span class="block text-xs font-bold text-yellow-800 uppercase mb-1"
              >Reviewer Comment</span
            >
            <span class="block text-sm text-yellow-900">{{
              getComment(row)
            }}</span>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- Standard Review Action Buttons             -->
        <!-- ========================================== -->
        <div
          v-if="mode !== 'checkout'"
          class="mt-8 pt-6 border-t border-gray-100"
        >
          <p
            class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center"
          >
            Correct Application Status
          </p>
          <div class="flex gap-3">
            <button
              v-if="getStatus(row) !== 'approved'"
              :disabled="updatingRow === row._rowIndex"
              @click="$emit('update-status', 'Approved')"
              class="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-black disabled:opacity-50 transition-colors"
            >
              {{ updatingRow === row._rowIndex ? "Saving..." : "Approve" }}
            </button>
            <button
              v-if="getStatus(row) !== 'rejected'"
              :disabled="updatingRow === row._rowIndex"
              @click="$emit('update-status', 'Rejected')"
              class="flex-1 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {{ updatingRow === row._rowIndex ? "Saving..." : "Reject" }}
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- Checkout Action Buttons (NEW)              -->
        <!-- ========================================== -->
        <div
          v-if="mode === 'checkout' && isItemUndelivered(row)"
          class="mt-8 pt-6 border-t border-gray-100"
        >
          <p
            class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center"
          >
            Process Handover
          </p>
          <div class="flex gap-3">
            <button
              :disabled="updatingRow === row._rowIndex"
              @click="$emit('update-status', 'Delivered')"
              class="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {{
                updatingRow === row._rowIndex
                  ? "Processing..."
                  : "Mark Delivered"
              }}
            </button>
            <button
              :disabled="updatingRow === row._rowIndex"
              @click="$emit('update-status', 'Issue Reported')"
              class="flex-1 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {{ updatingRow === row._rowIndex ? "Saving..." : "Report Issue" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Receipt Viewer (Hidden in Checkout Mode) -->
      <div
        v-if="mode !== 'checkout'"
        class="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh] md:min-h-150 relative"
      >
        <ReceiptViewer :receiptUrl="receiptUrl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReviewUtils } from "~/composables/useReviewUtils";

// Grab getCheckoutStatus to handle the new checkout button logic
const {
  formatName,
  getComment,
  formatHeader,
  getWhatsAppLink,
  getStatus,
  getCheckoutStatus,
} = useReviewUtils();

defineProps({
  isOpen: { type: Boolean, default: false },
  row: { type: Object, default: null },
  headers: { type: Array, default: () => [] },
  receiptUrl: { type: String, default: null },
  updatingRow: { type: Number, default: null },
  mode: { type: String, default: "review" },
});

defineEmits(["close", "update-status"]);

// Helper function to check if we should show the checkout buttons
const isItemUndelivered = (row) => {
  if (!row) return false;
  const deliveryStatus = getCheckoutStatus(row);

  if (!deliveryStatus) return true; // Blank means undelivered

  const normalizedStatus = deliveryStatus.toString().trim().toLowerCase();
  // Return true ONLY if it is not explicitly marked as delivered
  return (
    normalizedStatus !== "delivered" &&
    normalizedStatus !== "true" &&
    normalizedStatus !== "yes"
  );
};
</script>
