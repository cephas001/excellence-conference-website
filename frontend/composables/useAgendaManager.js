// composables/useAgendaManager.js
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

export const useAgendaManager = (agendaData) => {
  const SESSION_LENGTH_MINUTES = 60;
  const WAT_OFFSET = "+01:00";

  const currentTime = ref(new Date());
  let timeInterval;

  const selectedDate = ref("");
  const selectedSessionId = ref("");

  // Group agenda by Date
  const groupedAgenda = computed(() => {
    if (!agendaData.value) return [];
    const map = new Map();
    agendaData.value.forEach((doc) => {
      if (!map.has(doc.date)) {
        map.set(doc.date, { date: doc.date, docs: [] });
      }
      map.get(doc.date).docs.push(doc);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  });

  // Auto-select the first date and session when data arrives
  watch(
    groupedAgenda,
    (groups) => {
      if (groups.length > 0 && !selectedDate.value) {
        selectedDate.value = groups[0].date;
        if (groups[0].docs.length > 0) {
          selectedSessionId.value = groups[0].docs[0].id;
        }
      }
    },
    { immediate: true },
  );

  const selectDate = (date) => {
    selectedDate.value = date;
    const group = groupedAgenda.value.find((g) => g.date === date);
    if (group && group.docs.length > 0) {
      selectedSessionId.value = group.docs[0].id;
    }
  };

  const availableSessions = computed(() => {
    const group = groupedAgenda.value.find(
      (g) => g.date === selectedDate.value,
    );

    if (!group) return [];

    const seenSublabels = new Set();

    return group.docs.filter((doc) => {
      // Format the sublabel to ensure exact matching (e.g., "morning")
      const formatted = formatSublabel(doc.sublabel).toLowerCase();

      if (seenSublabels.has(formatted)) {
        return false; // Skip if we've already registered this session type
      }

      seenSublabels.add(formatted);
      return true; // Keep it if it's the first time seeing it
    });
  });

  const activeDocument = computed(() => {
    if (!agendaData.value) return null;
    return agendaData.value.find((d) => d.id === selectedSessionId.value);
  });

  // Parse time safely
  const parseDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch)
      return new Date(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0",
        )}T00:00:00${WAT_OFFSET}`,
      );

    let [, h, m, ampm] = timeMatch;
    let hours = parseInt(h, 10);
    const mins = parseInt(m, 10);
    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;

    return new Date(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0",
      )}T${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0",
      )}:00${WAT_OFFSET}`,
    );
  };

  // Map items to include Live/Completed/Upcoming status
  const roadmapItems = computed(() => {
    if (!activeDocument.value || !activeDocument.value.items) return [];

    return activeDocument.value.items.map((item) => {
      const start = parseDateTime(activeDocument.value.date, item.time);
      const end = new Date(
        start.getTime() + SESSION_LENGTH_MINUTES * 60 * 1000,
      );
      const now = currentTime.value;

      let status = "Upcoming";
      if (now >= start && now <= end) status = "Live";
      else if (now > end) status = "Completed";

      return { ...item, status };
    });
  });

  // UI Formatters
  const getMonthString = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", { month: "short" });
  const getDayString = (dateStr) =>
    new Date(dateStr).getDate().toString().padStart(2, "0");
  const formatSublabel = (sublabel) =>
    sublabel ? sublabel.split(",")[0].trim() : "Main Session";

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-red-900/20 text-red-500 border-red-900/50";
      case "Completed":
        return "bg-gray-900/50 text-gray-600 border-gray-800";
      default:
        return "bg-[#111827] text-gray-400 border-gray-700";
    }
  };

  onMounted(() => {
    timeInterval = setInterval(() => {
      currentTime.value = new Date();
    }, 60000);
  });

  onUnmounted(() => {
    clearInterval(timeInterval);
  });

  return {
    groupedAgenda,
    selectedDate,
    selectedSessionId,
    selectDate,
    availableSessions,
    activeDocument,
    roadmapItems,
    getMonthString,
    getDayString,
    formatSublabel,
    getStatusColor,
  };
};
