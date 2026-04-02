<template>
  <div class="max-w-6xl mx-auto pb-24 md:pb-0 relative">
    <ReviewHeader
      :loading="loading"
      @refresh="fetchApplications"
      @go-analytics="navigateTo('/dinner/analytics')"
      titleText="Workers Dinner Review"
    />

    <SearchBar v-model="searchQuery" placeholder="Search..." />

    <div class="mb-6 w-full">
      <ReviewNav
        :currentTab="currentTab"
        :pendingApplications="pendingApplications"
        :approvedApplications="approvedApplications"
        :rejectedApplications="rejectedApplications"
        :unsentApplications="unsentApplications"
        @update:currentTab="currentTab = $event"
      />
    </div>

    <ReviewLoader v-if="loading && applications.length === 0" />

    <div v-else-if="currentTab === 'review'">
      <EmptyReviewState
        v-if="pendingApplications.length === 0"
        title="You're all caught up!"
        subtitle="There are no pending dinner applications right now."
      />

      <div
        v-else-if="currentApp"
        class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative flex flex-col md:flex-row font-montserrat"
      >
        <div
          class="flex-1 p-6 pb-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col h-full"
        >
          <ReviewIndicator
            :currentIndex="currentIndex"
            :applications="pendingApplications"
            @previous="prevApp"
            @next="nextApp"
          />

          <ReviewDataList :headers="dataHeaders" :data="currentApp">
            <template #field="{ header, value }">
              <div
                v-if="header.toLowerCase().includes('name')"
                class="relative"
              >
                <div
                  class="flex items-center justify-between p-2 -ml-2 rounded-lg transition-colors"
                  :class="
                    getWorkerMatch(value).status !== 'unverified'
                      ? 'hover:bg-gray-100 cursor-pointer'
                      : ''
                  "
                  @click="
                    getWorkerMatch(value).status !== 'unverified' &&
                    toggleNameDropdown(currentApp._rowIndex)
                  "
                >
                  <p
                    class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
                  >
                    {{ formatName(value) || "—" }}
                  </p>
                  <div class="ml-2 shrink-0">
                    <span
                      v-if="getWorkerMatch(value).status === 'unverified'"
                      class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md font-semibold"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Unverified
                    </span>
                    <span
                      v-else
                      class="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-semibold"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{
                        getWorkerMatch(value).status === "exact"
                          ? "Verified"
                          : "Check Match"
                      }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="
                    openNameDropdowns[currentApp._rowIndex] &&
                    getWorkerMatch(value).status !== 'unverified'
                  "
                  class="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm animate-fade-in-up"
                >
                  <p class="text-xs font-bold text-blue-800 uppercase mb-2">
                    Closest Database Matches:
                  </p>
                  <ul class="space-y-2">
                    <li
                      v-for="(match, idx) in getWorkerMatch(value).matches"
                      :key="idx"
                      class="flex items-start text-blue-900 font-medium"
                    >
                      <svg
                        class="w-3 h-3 mr-2 mt-1 text-blue-400 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      <div>
                        <span class="block">{{ formatName(match.name) }}</span>
                        <span
                          class="block text-xs text-blue-600 opacity-80 mt-0.5"
                          >Unit: {{ match.unit }}</span
                        >
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                v-else-if="
                  header.toLowerCase().includes('phone') ||
                  header.toLowerCase().includes('whatsapp')
                "
                class="flex items-center"
              >
                <p
                  class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
                >
                  {{ value || "—" }}
                </p>
                <a
                  v-if="value"
                  :href="getWhatsAppLink(value)"
                  target="_blank"
                  class="ml-2 text-green-500 hover:text-green-600 hover:scale-110 transition-transform bg-green-50 p-1.5 rounded-full"
                  title="Chat on WhatsApp"
                >
                  <IconsWhatsApp />
                </a>
              </div>

              <p
                v-else
                class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
              >
                {{ value || "—" }}
              </p>
            </template>

            <template #footer>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <label
                  class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                  >Reviewer Comments (Optional)</label
                >
                <textarea
                  v-model="reviewComment"
                  rows="3"
                  placeholder="Leave a note about this application..."
                  class="w-full text-sm border border-gray-300 focus:border-black rounded-lg p-3 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </template>
          </ReviewDataList>
        </div>

        <div
          class="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col items-center justify-center min-h-137.5 md:min-h-175 relative"
        >
          <h4
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 w-full text-left"
          >
            Uploaded Receipt
          </h4>
          <ReceiptViewer :receiptUrl="currentReceiptUrl" />
          <a
            v-if="currentReceiptUrl"
            :href="currentReceiptUrl"
            target="_blank"
            class="mt-4 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            Open receipt in full screen <IconsNewTab />
          </a>
        </div>
      </div>
    </div>

    <ReviewDataTable
      v-else
      :headers="dataHeaders"
      :data="activeSummaryList"
      @row-click="openDetailsModal"
    >
      <template #empty-state>No {{ currentTab }} applications found.</template>
      <template v-if="currentTab === 'unsent'" #header-action>
        <th
          class="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
        >
          Actions
        </th>
      </template>
      <template v-if="currentTab === 'unsent'" #row-action="{ row }">
        <td class="px-6 py-4 text-right whitespace-nowrap" @click.stop>
          <button
            @click="resendEmail(row)"
            :disabled="resendingRows.includes(row._rowIndex)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-full shadow-sm text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {{
              resendingRows.includes(row._rowIndex) ? "Sending..." : "Resend"
            }}
          </button>
        </td>
      </template>
    </ReviewDataTable>

    <ReviewModal
      :isOpen="isModalOpen"
      :row="selectedRow"
      :headers="dataHeaders"
      :receiptUrl="selectedReceiptUrl"
      :updatingRow="updatingRow"
      @close="isModalOpen = false"
      @update-status="handleModalStatusUpdate"
    />

    <ReviewFabMenu
      :disabled="updatingRow === currentApp?._rowIndex"
      :showApproveReject="currentTab === 'review' && !!currentApp"
      @approve="updateStatus(currentApp._rowIndex, 'Approved')"
      @reject="updateStatus(currentApp._rowIndex, 'Rejected')"
      @toggle-details="showInfoPanel = !showInfoPanel"
    />

    <DinnerInfoPanel v-if="showInfoPanel" @close="showInfoPanel = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { useWorkerSearch } from "~/composables/useWorkerSearch";
import { useReviewUtils } from "~/composables/useReviewUtils";

const { formatName, getWhatsAppLink, getComment } = useReviewUtils();

// Initialize the queue specifically for 'dinner'
const {
  applications, // <--- ADDED THIS BACK IN!
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
} = useReviewQueue("dinner", {
  hiddenColumns: [
    "WHAT IS THE MOST UNIQUE THING ABOUT YOU?",
    'WHAT IS YOUR EXPECTATION FOR "THE CORONATION"?',
  ],
});

// Initialize Worker Search
const { openNameDropdowns, fetchWorkers, getWorkerMatch, toggleNameDropdown } =
  useWorkerSearch();

// Watch for tab changes and trigger a fresh data pull for the 'unsent' tab
watch(currentTab, (newTab) => {
  if (newTab === "unsent") {
    fetchApplications();
  }
});

const handleModalStatusUpdate = async (newStatus) => {
  // Pre-fill the existing comment so it doesn't get erased during the correction
  reviewComment.value = getComment(selectedRow.value) || "";

  // Make the API call
  await updateStatus(selectedRow.value._rowIndex, newStatus);

  // Close the modal once the database finishes updating
  isModalOpen.value = false;
};

onMounted(() => {
  fetchApplications();
  fetchWorkers();
});
</script>
