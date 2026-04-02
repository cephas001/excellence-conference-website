<template>
  <div
    class="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden font-montserrat"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              @click="handleSort(header)"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none group hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                {{ formatHeader(header) }}

                <span
                  class="text-gray-300 group-hover:text-gray-500 transition-colors inline-flex ml-1"
                >
                  <svg
                    v-if="sortColumn === header && sortDirection === 'asc'"
                    class="w-4 h-4 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    ></path>
                  </svg>

                  <svg
                    v-else-if="
                      sortColumn === header && sortDirection === 'desc'
                    "
                    class="w-4 h-4 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>

                  <svg
                    v-else
                    class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    ></path>
                  </svg>
                </span>
              </div>
            </th>

            <slot name="header-action"></slot>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="data.length === 0">
            <td
              :colspan="
                $slots['header-action'] ? headers.length + 1 : headers.length
              "
              class="px-4 py-12 text-center text-sm text-gray-500"
            >
              <slot name="empty-state">No applications found.</slot>
            </td>
          </tr>

          <tr
            v-for="row in sortedData"
            :key="row._rowIndex"
            @click="$emit('row-click', row)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td
              v-for="header in headers"
              :key="header"
              class="px-4 py-4 text-xs text-gray-700 whitespace-nowrap"
            >
              {{
                header.toLowerCase().includes("name")
                  ? formatName(row[header])
                  : row[header]
              }}
            </td>

            <slot name="row-action" :row="row"></slot>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useReviewUtils } from "~/composables/useReviewUtils";

const { formatName, formatHeader } = useReviewUtils();

const props = defineProps({
  headers: { type: Array, required: true },
  data: { type: Array, required: true },
});

defineEmits(["row-click"]);

// --- SORTING STATE & LOGIC ---
const sortColumn = ref("");
const sortDirection = ref("asc");

const handleSort = (headerKey) => {
  if (sortColumn.value === headerKey) {
    // Toggle direction if clicking the same column
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Set new column and default to ascending
    sortColumn.value = headerKey;
    sortDirection.value = "asc";
  }
};

const sortedData = computed(() => {
  // If no column has been clicked yet, return the raw data untouched
  if (!sortColumn.value || !props.data) {
    return props.data;
  }

  // Use [...props.data] to create a shallow copy so we don't mutate the original prop
  return [...props.data].sort((a, b) => {
    let valA = a[sortColumn.value];
    let valB = b[sortColumn.value];

    // Safely convert values to lowercase strings to ensure A-Z alphabetical sorting
    // (If a cell is blank/undefined, it becomes an empty string)
    valA = valA ? String(valA).toLowerCase() : "";
    valB = valB ? String(valB).toLowerCase() : "";

    if (valA < valB) return sortDirection.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});
</script>
