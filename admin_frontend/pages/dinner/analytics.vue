<template>
  <div class="space-y-6 font-montserrat">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-900">Dinner Analytics</h2>
        <p class="text-sm text-gray-500 mt-1">
          Real-time breakdown of dinner reservations
        </p>
      </div>

      <div class="mt-4 sm:mt-0 flex flex-wrap items-center gap-4">
        <div class="flex bg-gray-100 p-1 rounded-xl">
          <button
            @click="filterMode = 'all'"
            :class="
              filterMode === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            All Orders
          </button>
          <button
            @click="filterMode = 'approved'"
            :class="
              filterMode === 'approved'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Approved Only
          </button>
        </div>

        <button
          @click="exportToCSV"
          class="flex items-center gap-2 bg-black hover:bg-black/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        class="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col justify-center"
      >
        <span class="text-blue-600 text-sm font-bold uppercase tracking-wider"
          >Total Reservations</span
        >
        <span class="text-4xl font-black text-black mt-2">{{
          filteredData.length
        }}</span>
      </div>
      <div
        class="bg-green-50 border border-green-100 p-6 rounded-2xl flex flex-col justify-center"
      >
        <span class="text-green-600 text-sm font-bold uppercase tracking-wider"
          >Projected Income</span
        >
        <span class="text-4xl font-black text-black mt-2"
          >₦{{ totalIncome.toLocaleString() }}</span
        >
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          Table Preferences (Tribes)
        </h3>
        <ul class="space-y-3">
          <li
            v-for="(count, table) in tableCounts"
            :key="table"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
          >
            <span class="font-semibold text-black text-sm capitalize">{{
              table
            }}</span>
            <span
              class="font-black text-lg bg-white px-3 py-1 rounded-lg shadow-sm"
              >{{ count }}</span
            >
          </li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          Ticket Email Delivery
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(count, status) in emailStatusCounts"
            :key="status"
            class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <span class="text-2xl font-black text-black mb-1">{{ count }}</span>
            <span class="text-xs font-semibold text-gray-500 uppercase">{{
              status || "Pending"
            }}</span>
          </div>
          <div
            v-if="Object.keys(emailStatusCounts).length === 0"
            class="col-span-2 p-4 text-center text-sm text-gray-400 font-medium"
          >
            No ticket emails have been sent yet.
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">
        Reservations By Chapel Unit
      </h3>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="(count, unit) in unitCounts"
          :key="unit"
          class="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl flex items-center gap-3"
        >
          <span class="text-sm font-semibold text-black capitalize">{{
            unit
          }}</span>
          <span
            class="bg-black text-white text-xs font-bold px-2 py-1 rounded-md"
            >{{ count }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useReviewQueue } from "~/composables/useReviewQueue";

// Initialize the queue specifically for 'dinner'
const { applications, fetchApplications } = useReviewQueue("dinner", {
  hiddenColumns: ["Reviewer"],
});

const filterMode = ref("all");

// Safe Extraction Utility
const findValue = (row, keyword) => {
  const key = Object.keys(row).find((k) =>
    k.toLowerCase().includes(keyword.toLowerCase()),
  );
  return key ? row[key] : null;
};

// 1. Ghost Row Filter (Ensure they at least have a Name or Unit)
const validApplications = computed(() => {
  return applications.value.filter((app) => {
    const name = findValue(app, "name");
    const unit = findValue(app, "unit");
    return (
      (name && name.toString().trim() !== "") ||
      (unit && unit.toString().trim() !== "")
    );
  });
});

// 2. Status Filter
const filteredData = computed(() => {
  if (filterMode.value === "approved") {
    return validApplications.value.filter((app) => {
      const status = findValue(app, "status");
      return status && status.toString().trim().toLowerCase() === "approved";
    });
  }
  return validApplications.value;
});

// 3. Flat Rate Income Calculation (₦5,000 per person)
const totalIncome = computed(() => {
  return filteredData.value.length * 5000;
});

// 4. Dynamic Attribute Counters (Units, Tables, Email Status)
const countDynamicAttribute = (keyword) => {
  const counts = {};
  filteredData.value.forEach((app) => {
    let val = findValue(app, keyword);
    if (val !== null && val !== undefined) {
      val = val.toString().trim().toLowerCase();
      if (val && val !== "—" && val !== "n/a") {
        counts[val] = (counts[val] || 0) + 1;
      }
    }
  });
  return Object.fromEntries(
    Object.entries(counts).sort(([, a], [, b]) => b - a),
  );
};

// Extracting the specific Google Form data points
const unitCounts = computed(() => countDynamicAttribute("unit"));
const tableCounts = computed(() => countDynamicAttribute("table"));
const emailStatusCounts = computed(() => countDynamicAttribute("email status"));

// 5. Export to CSV Function
const exportToCSV = () => {
  if (filteredData.value.length === 0) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(filteredData.value[0]).filter(
    (key) => !key.startsWith("_"),
  );
  const csvRows = [];

  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","));

  for (const row of filteredData.value) {
    const values = headers.map((header) => {
      const val =
        row[header] !== null && row[header] !== undefined
          ? String(row[header])
          : "";
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `EC_Dinner_${filterMode.value}_${dateStr}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchApplications();
});
</script>
