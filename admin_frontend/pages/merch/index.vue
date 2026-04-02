<template>
  <div class="max-w-6xl mx-auto pb-24 md:pb-0 relative">
    <ReviewHeader
      :loading="loading"
      @refresh="fetchApplications"
      @go-analytics="navigateTo('/merch/analytics')"
      titleText="Merchandise Review"
    />

    <SearchBar v-model="searchQuery" placeholder="Search..." />

    <div class="border-b border-gray-200 mb-6">
      <ReviewNav
        :currentTab="currentTab"
        :pendingApplications="pendingApplications"
        :approvedApplications="approvedApplications"
        :rejectedApplications="rejectedApplications"
        @update:currentTab="currentTab = $event"
      />
    </div>

    <ReviewLoader v-if="loading && applications.length === 0" />

    <div v-else-if="currentTab === 'review'">
      <EmptyReviewState
        v-if="pendingApplications.length === 0"
        title="Merch queue is empty!"
        subtitle="All merchandise receipts have been processed."
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
            <template #footer>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <label
                  class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                  >Reviewer Comments (Optional)</label
                >
                <textarea
                  v-model="reviewComment"
                  rows="3"
                  placeholder="Leave a note about this receipt..."
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
      <template #empty-state>
        No {{ currentTab }} applications found.
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

    <MerchInfoPanel v-if="showInfoPanel" @close="showInfoPanel = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { useReviewUtils } from "~/composables/useReviewUtils";

const { getComment } = useReviewUtils();

// Initialize the queue specifically for 'merch'
const {
  applications,
  searchQuery,
  loading,
  updatingRow,
  currentTab,
  currentIndex,
  reviewComment,
  showInfoPanel,
  isModalOpen,
  selectedRow,
  pendingApplications,
  currentApp,
  approvedApplications,
  rejectedApplications,
  activeSummaryList,
  dataHeaders,
  currentReceiptUrl,
  selectedReceiptUrl,
  nextApp,
  prevApp,
  openDetailsModal,
  fetchApplications,
  updateStatus,
} = useReviewQueue("merch", {
  hiddenColumns: ["Reviewer"],
});

const handleModalStatusUpdate = async (newStatus) => {
  reviewComment.value = getComment(selectedRow.value) || "";
  await updateStatus(selectedRow.value._rowIndex, newStatus);
  isModalOpen.value = false;
};

onMounted(() => fetchApplications());
</script>
