import { ref } from "vue";
import { useRuntimeConfig, useCookie } from "#app";
import Fuse from "fuse.js";

export const useWorkerSearch = () => {
  const config = useRuntimeConfig();
  const token = useCookie("ec_token");

  const officialWorkers = ref([]);
  const fuseEngine = ref(null);
  const openNameDropdowns = ref({});

  const fetchWorkers = async () => {
    try {
      const response = await $fetch(
        `${config.public.apiBase}/applications/workers`,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        },
      );
      officialWorkers.value = response.data;
      fuseEngine.value = new Fuse(officialWorkers.value, {
        keys: ["name"],
        includeScore: true,
        threshold: 0.4,
      });
    } catch (err) {
      console.error("Failed to load workers database");
    }
  };

  const getWorkerMatch = (applicantName) => {
    if (!fuseEngine.value || !applicantName)
      return { status: "unverified", matches: [] };
    const results = fuseEngine.value.search(applicantName);
    if (results.length === 0) return { status: "unverified", matches: [] };
    if (results[0].score < 0.1)
      return { status: "exact", matches: [results[0].item] };
    return { status: "fuzzy", matches: results.slice(0, 3).map((r) => r.item) };
  };

  const toggleNameDropdown = (rowIndex) => {
    openNameDropdowns.value[rowIndex] = !openNameDropdowns.value[rowIndex];
  };

  return {
    officialWorkers,
    openNameDropdowns,
    fetchWorkers,
    getWorkerMatch,
    toggleNameDropdown,
  };
};
