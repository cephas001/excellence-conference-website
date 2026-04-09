<template>
  <div class="space-y-6 font-montserrat">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-900">Merch Analytics</h2>
        <p class="text-sm text-gray-500 mt-1">
          Real-time breakdown of merchandise orders
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-wrap items-start gap-4">
        <div class="flex flex-col gap-2">
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

          <label
            v-if="filterMode === 'all'"
            class="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer ml-1 select-none hover:text-gray-800 transition-colors group"
          >
            <div class="relative flex items-center justify-center w-4 h-4">
              <input
                type="checkbox"
                v-model="excludeRejected"
                class="peer sr-only"
              />

              <div
                class="absolute inset-0 bg-white border border-gray-300 rounded peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-1 transition-colors"
              ></div>

              <svg
                class="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <span class="mt-[0.5px]">Exclude Rejected Applications</span>
          </label>
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
          >Total Orders</span
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
          >₦{{ analytics.projectedIncome.toLocaleString() }}</span
        >
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          Orders By Package
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, pkg) in analytics.packageCounts"
            :key="pkg"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
          >
            <span class="font-semibold text-black text-sm">{{ pkg }}</span>
            <span
              class="font-black text-lg bg-white px-3 py-1 rounded-lg shadow-sm"
              >{{ count }}</span
            >
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          Individual Item Requirements
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(count, item) in analytics.itemCounts"
            :key="item"
            class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <span class="text-2xl font-black text-black mb-1">{{ count }}</span>
            <span class="text-xs font-semibold text-gray-500 uppercase">{{
              item
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          T-Shirt Colors & Sizes
        </h3>
        <ul class="space-y-4">
          <li
            v-for="(data, color) in colorAndSizeBreakdown"
            :key="color"
            class="flex flex-col border-b border-gray-50 pb-4 last:border-0 last:pb-0"
          >
            <div class="flex justify-between items-center w-full mb-2">
              <span class="text-sm font-bold text-black capitalize">{{
                color
              }}</span>
              <span class="text-sm font-black text-gray-900">{{
                data.total
              }}</span>
            </div>

            <div
              v-if="Object.keys(data.sizes).length > 0"
              class="flex flex-wrap gap-1.5"
            >
              <span
                v-for="(sCount, size) in data.sizes"
                :key="size"
                class="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
              >
                {{ size }}: <span class="text-black ml-1">{{ sCount }}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
        >
          T-Shirt Sizes
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(count, size) in sizeCounts"
            :key="size"
            class="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
          >
            <span class="text-sm font-medium text-black capitalize">{{
              size
            }}</span>
            <span class="text-sm font-bold text-gray-900">{{ count }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">
        Orders By Level
      </h3>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="(count, level) in levelCounts"
          :key="level"
          class="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl flex items-center gap-3"
        >
          <span class="text-sm font-semibold text-black uppercase">{{
            level
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
import { useAlertModal } from "~/composables/useAlertModal";

// Initialize the queue specifically for 'merch'
const { applications, fetchApplications } = useReviewQueue("merch", {
  hiddenColumns: ["Reviewer"],
});

const { showAlert } = useAlertModal();

const filterMode = ref("all");
const excludeRejected = ref(false);

// Utility to safely extract values regardless of slight column name changes
const findValue = (row, keyword) => {
  const key = Object.keys(row).find((k) =>
    k.toLowerCase().includes(keyword.toLowerCase()),
  );
  return key ? row[key] : null;
};

// 1. Filter Engine
const validApplications = computed(() => {
  // First, strip out completely empty rows (Ghost Rows)
  return applications.value.filter((app) => {
    const pkg = findValue(app, "package") || findValue(app, "order");
    return pkg && pkg.toString().trim() !== "";
  });
});

const filteredData = computed(() => {
  // Scenario A: Only showing Approved
  if (filterMode.value === "approved") {
    return validApplications.value.filter((app) => {
      const status = findValue(app, "status");
      return status && status.toString().trim().toLowerCase() === "approved";
    });
  }

  // Scenario B: Showing "All", but checkbox is ticked to hide Rejected
  if (filterMode.value === "all" && excludeRejected.value) {
    return validApplications.value.filter((app) => {
      const status = findValue(app, "status");
      // Keep it if the status is NOT 'rejected'
      return !(status && status.toString().trim().toLowerCase() === "rejected");
    });
  }

  // Scenario C: Showing absolutely everything
  return validApplications.value;
});

// 2. The Single-Pass Parser (Calculates Income, Items, and Packages simultaneously)
const analytics = computed(() => {
  const pCounts = {
    Premium: 0,
    Deluxe: 0,
    Standard: 0,
    Minimum: 0,
    "T-Shirt only": 0,
    "Wristband only": 0,
    "Custom/Mixed": 0,
  };
  const iCounts = {
    "T-Shirts": 0,
    Jotters: 0,
    Wristbands: 0,
    "Water Bottles": 0,
  };
  let totalIncome = 0;

  filteredData.value.forEach((app) => {
    // Look for a package or order column
    const pkgRaw = findValue(app, "package") || findValue(app, "order") || "";
    const p = pkgRaw.toLowerCase();

    if (!p || p === "—") return;

    // A. Explicit Packages
    if (p.includes("premium") || p.includes("all")) {
      pCounts["Premium"]++;
      totalIncome += 10000;
      iCounts["T-Shirts"]++;
      iCounts["Jotters"]++;
      iCounts["Wristbands"]++;
      iCounts["Water Bottles"]++;
    } else if (p.includes("deluxe")) {
      pCounts["Deluxe"]++;
      totalIncome += 8000;
      iCounts["T-Shirts"]++;
      iCounts["Jotters"]++;
      iCounts["Wristbands"]++;
    } else if (p.includes("standard")) {
      pCounts["Standard"]++;
      totalIncome += 7000;
      iCounts["T-Shirts"]++;
      iCounts["Jotters"]++;
    } else if (p.includes("minimum")) {
      pCounts["Minimum"]++;
      totalIncome += 3500;
      iCounts["Water Bottles"]++;
      // Handles the discrepancy if Minimum is recorded as Wristband vs Jotter
      if (p.includes("wristband")) iCounts["Wristbands"]++;
      else iCounts["Jotters"]++;
    }
    // B. Singles & Custom Strings
    else {
      const hasTshirt =
        p.includes("t-shirt") || p.includes("tshirt") || p.includes("t shirt");
      const hasWristband = p.includes("wristband");
      const hasJotter = p.includes("jotter");
      const hasBottle = p.includes("bottle");

      // Strict "Only T-Shirt" / "T-Shirt only" catch
      if (hasTshirt && !hasWristband && !hasJotter && !hasBottle) {
        pCounts["T-Shirt only"]++;
        totalIncome += 5000;
        iCounts["T-Shirts"]++;
      }
      // Strict "Only Wristband" / "Wristband only" catch
      else if (hasWristband && !hasTshirt && !hasJotter && !hasBottle) {
        pCounts["Wristband only"]++;
        totalIncome += 1000;
        iCounts["Wristbands"]++;
      }
      // The "wristband and T-shirt" fallback (Custom Combinations)
      else if (hasTshirt || hasWristband || hasJotter || hasBottle) {
        pCounts["Custom/Mixed"]++;
        if (hasTshirt) {
          iCounts["T-Shirts"]++;
          totalIncome += 5000;
        }
        if (hasWristband) {
          iCounts["Wristbands"]++;
          totalIncome += 1000;
        }
        if (hasJotter) {
          iCounts["Jotters"]++;
        }
        if (hasBottle) {
          iCounts["Water Bottles"]++;
        }
      }
    }
  });

  // Clean up the object before returning so the UI doesn't show 'Custom/Mixed: 0'
  if (pCounts["Custom/Mixed"] === 0) delete pCounts["Custom/Mixed"];

  return {
    packageCounts: pCounts,
    itemCounts: iCounts,
    projectedIncome: totalIncome,
  };
});

// 3. Dynamic Attribute Counters (Colors, Sizes, Levels)
const countDynamicAttribute = (keyword) => {
  const counts = {};
  filteredData.value.forEach((app) => {
    let val = findValue(app, keyword);

    // Check if it exists and isn't empty
    if (val !== null && val !== undefined) {
      // Force everything to lowercase and remove spaces for perfect grouping!
      val = val.toString().trim().toLowerCase();

      if (val && val !== "—") {
        counts[val] = (counts[val] || 0) + 1;
      }
    }
  });
  // Sort from highest count to lowest
  return Object.fromEntries(
    Object.entries(counts).sort(([, a], [, b]) => b - a),
  );
};

const colorCounts = computed(() => countDynamicAttribute("color"));
const sizeCounts = computed(() => countDynamicAttribute("size"));
const levelCounts = computed(() => countDynamicAttribute("level"));

// NEW: Advanced nested parser for Colors + Sizes
// NEW: Advanced nested parser for Colors + Sizes (with Missing Size detection)
const colorAndSizeBreakdown = computed(() => {
  const breakdown = {};

  filteredData.value.forEach((app) => {
    let color = findValue(app, "color");
    let size = findValue(app, "size");

    if (color !== null && color !== undefined) {
      color = color.toString().trim().toLowerCase();

      if (color && color !== "—") {
        // Initialize the color bucket
        if (!breakdown[color]) {
          breakdown[color] = { total: 0, sizes: {} };
        }

        // 1. ALWAYS increment the total count for this color
        breakdown[color].total++;

        // 2. Safely process the size, defaulting to 'unspecified' if missing
        let validSize = "unspecified";

        if (size !== null && size !== undefined) {
          const cleanSize = size.toString().trim().toLowerCase();
          if (cleanSize && cleanSize !== "—") {
            validSize = cleanSize;
          }
        }

        // 3. Increment the specific size (or the 'unspecified' bucket)
        breakdown[color].sizes[validSize] =
          (breakdown[color].sizes[validSize] || 0) + 1;
      }
    }
  });

  // Sort the colors from highest total orders to lowest
  const sorted = Object.entries(breakdown).sort(
    (a, b) => b[1].total - a[1].total,
  );
  return Object.fromEntries(sorted);
});

// 4. Export to CSV Function
const exportToCSV = () => {
  if (filteredData.value.length === 0) {
    showAlert("No data available to export.", "warning", "Export Failed");
    return;
  }

  // Dynamically grab all column headers from the first row (ignoring Nuxt internal keys like _rowIndex)
  const headers = Object.keys(filteredData.value[0]).filter(
    (key) => !key.startsWith("_"),
  );
  const csvRows = [];

  // 1. Push the Header Row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","));

  // 2. Push the Data Rows
  for (const row of filteredData.value) {
    const values = headers.map((header) => {
      const val =
        row[header] !== null && row[header] !== undefined
          ? String(row[header])
          : "";
      // Escape any internal quotes and wrap the whole cell in quotes so commas in addresses/names don't break the columns
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  // 3. Create a Blob and trigger the download
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  // Name the file dynamically based on the current filter so you don't mix them up!
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `EC_Merch_${filterMode.value}_${dateStr}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchApplications();
});
</script>
