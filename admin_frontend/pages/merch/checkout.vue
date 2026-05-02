<template>
  <div class="max-w-6xl mx-auto pb-24 md:pb-0 relative">
    <ReviewHeader
      :loading="loading"
      @refresh="fetchApplications"
      :show-analytics="false"
      titleText="Merchandise Checkout"
    />

    <SearchBar v-model="searchQuery" placeholder="Search Approved Orders..." />

    <div class="border-b border-gray-200 mb-6">
      <CheckoutNav
        :currentTab="currentTab"
        :deliveredApplications="deliveredApplications"
        :undeliveredApplications="undeliveredApplications"
        :reportedApplications="reportedApplications"
        @update:currentTab="currentTab = $event"
      />
    </div>

    <ReviewLoader v-if="loading && applications.length === 0" />

    <div v-else-if="currentTab === 'review'">
      <EmptyReviewState
        v-if="undeliveredApplications.length === 0"
        title="Checkout queue is empty!"
        subtitle="All merchandise orders have been checked out."
      />

      <div
        v-else-if="currentCheckoutApp"
        class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative flex flex-col md:flex-row font-montserrat"
      >
        <div
          class="flex-1 p-6 pb-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col h-full"
        >
          <!-- CHANGED: Pass undelivered array and new nav functions -->
          <ReviewIndicator
            :currentIndex="currentIndex"
            :applications="undeliveredApplications"
            @previous="prevCheckoutApp"
            @next="nextCheckoutApp"
          />

          <!-- CHANGED: Now using currentCheckoutApp -->
          <ReviewDataList :headers="dataHeaders" :data="currentCheckoutApp">
            <template #footer>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <label
                  class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >
                  Volunteer Notes (Optional)
                </label>
                <textarea
                  v-model="reviewComment"
                  rows="3"
                  placeholder="Leave a note about this handover..."
                  class="w-full text-sm border border-gray-300 focus:border-black rounded-lg p-3 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </template>
          </ReviewDataList>
        </div>
      </div>
    </div>

    <!-- The table view for searching delivered items -->
    <ReviewDataTable
      v-else-if="currentTab === 'table_review'"
      :headers="dataHeaders"
      :data="undeliveredApplications"
      @row-click="openDetailsModal"
    >
      <template #empty-state> No pending checkouts found. </template>
    </ReviewDataTable>

    <ReviewDataTable
      v-else-if="currentTab === 'reported'"
      :headers="dataHeaders"
      :data="reportedApplications"
      @row-click="openDetailsModal"
    >
      <template #empty-state> No pending checkouts found. </template>
    </ReviewDataTable>

    <ReviewDataTable
      v-else
      :headers="dataHeaders"
      :data="deliveredApplications"
      @row-click="openDetailsModal"
    >
      <template #empty-state> No pending checkouts found. </template>
    </ReviewDataTable>

    <ReviewModal
      :isOpen="isModalOpen"
      :row="selectedRow"
      :headers="dataHeaders"
      :receiptUrl="null"
      :updatingRow="updatingRow"
      @close="isModalOpen = false"
      @update-status="handleModalStatusUpdate"
      mode="checkout"
    />

    <ReviewFabMenu
      :disabled="updatingRow === currentCheckoutApp?._rowIndex"
      :showApproveReject="currentTab === 'review' && !!currentCheckoutApp"
      @approve="updateCheckoutStatus(currentCheckoutApp._rowIndex, 'Delivered')"
      @reject="
        updateCheckoutStatus(currentCheckoutApp._rowIndex, 'Issue Reported')
      "
      @toggle-details="showInfoPanel = !showInfoPanel"
    />

    <MerchInfoPanel v-if="showInfoPanel" @close="showInfoPanel = false" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { useReviewUtils } from "~/composables/useReviewUtils";

const { getComment } = useReviewUtils();

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
  currentCheckoutApp,
  nextCheckoutApp,
  prevCheckoutApp,
  undeliveredApplications,
  dataHeaders,
  fetchApplications,
  updateCheckoutStatus,
  openDetailsModal,
  deliveredApplications,
  reportedApplications,
} = useReviewQueue("merch", {
  hiddenColumns: ["Reviewer", "Receipt", "Delivered", "Fulfillment Batch"],
});

const handleModalStatusUpdate = async (newStatus) => {
  reviewComment.value = getComment(selectedRow.value) || "";

  await updateCheckoutStatus(selectedRow.value._rowIndex, newStatus);
  isModalOpen.value = false;
};

onMounted(() => fetchApplications());
</script>
