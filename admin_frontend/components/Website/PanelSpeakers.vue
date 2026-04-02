<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Speakers
      </h2>
      <p class="text-sm text-gray-500 font-medium">
        Manage keynote speakers, ministerial roles, and session topics for 2026.
      </p>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-if="speakers.length === 0"
          class="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50"
        >
          <Icon
            name="heroicons:user-plus"
            class="w-12 h-12 mb-4 text-gray-300"
          />
          <p class="text-sm font-medium">
            {{ loading ? "Loading speakers..." : "No speakers added yet." }}
          </p>
        </div>

        <div
          v-else
          v-for="speaker in speakers"
          :key="speaker.id"
          class="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div
            class="flex flex-col sm:flex-row items-start justify-between gap-6"
          >
            <div class="flex gap-5 items-center sm:items-start">
              <div
                class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50"
              >
                <img
                  v-if="speaker.image"
                  :src="speaker.image"
                  :alt="speaker.name"
                  class="w-full h-full object-cover"
                />
                <Icon
                  v-else
                  name="heroicons:user"
                  class="w-full h-full p-4 text-gray-300"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">
                  {{ speaker.name }}
                </h3>
                <p
                  class="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3"
                >
                  {{ speaker.role || "No Role Specified" }}
                </p>
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                  <Icon
                    name="heroicons:academic-cap"
                    class="w-4 h-4 text-gray-400"
                  />
                  <span class="truncate max-w-[200px] sm:max-w-md">{{
                    speaker.topic || "No topic assigned"
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 mt-4 sm:mt-0"
            >
              <button
                @click="editSpeaker(speaker)"
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <Icon name="heroicons:pencil-square" class="w-4 h-4" /> Edit
              </button>
              <button
                @click="handleDelete(speaker.id)"
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          class="sticky top-10 rounded-2xl bg-white p-6 sm:p-8 border border-gray-100 shadow-lg"
        >
          <h3
            class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <Icon
              name="heroicons:pencil-square"
              class="text-gray-400 w-5 h-5"
            />
            {{ speakerForm.id ? "Edit Speaker" : "Add Speaker" }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Full Name *</label
              >
              <input
                v-model="speakerForm.name"
                type="text"
                required
                placeholder="e.g. Dr. Jane Doe"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Role / Designation</label
              >
              <input
                v-model="speakerForm.role"
                type="text"
                placeholder="Keynote Speaker"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Topic</label
              >
              <input
                v-model="speakerForm.topic"
                type="text"
                placeholder="Enter session title"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Image URL</label
              >
              <input
                v-model="speakerForm.image"
                type="text"
                placeholder="/img/speaker.jpg"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Biography</label
              >
              <textarea
                v-model="speakerForm.bio"
                rows="3"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div class="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                class="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-900 transition-colors"
              >
                Save Profile
              </button>
              <button
                v-if="speakerForm.id"
                @click="resetForm"
                type="button"
                class="px-6 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Ensure your composables are correctly auto-imported or manually imported depending on your Nuxt setup
const { getSpeakers } = useConferenceData();
const { addSpeaker, updateSpeaker, deleteSpeaker } = useAdminMutations();
const { showAlert } = useAlertModal();

const speakers = ref([]);
const loading = ref(true);

const speakerForm = ref({
  id: "",
  name: "",
  role: "",
  topic: "",
  image: "",
  bio: "",
});

const loadData = async () => {
  loading.value = true;
  try {
    const response = await getSpeakers();

    // Check if your backend wraps it in a 'data' object. If it's a direct array, change this to:
    // speakers.value = Array.isArray(response) ? response : [];
    speakers.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    // Prevent double-modals if the global interceptor caught a 403 Forbidden error
    if (error.response?._handledGlobally) return;

    // Use our sleek new custom modal instead of the ugly browser alert
    showAlert("Failed to load speakers.", "error");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  speakerForm.value = {
    id: "",
    name: "",
    role: "",
    topic: "",
    image: "",
    bio: "",
  };
};

const editSpeaker = (speaker) => {
  speakerForm.value = { ...speaker };
};

const handleSubmit = async () => {
  const payload = {
    name: speakerForm.value.name.trim(),
    role: speakerForm.value.role.trim(),
    topic: speakerForm.value.topic.trim(),
    image: speakerForm.value.image.trim(),
    bio: speakerForm.value.bio.trim(),
  };

  try {
    if (speakerForm.value.id) {
      await updateSpeaker(speakerForm.value.id, payload);
      showAlert("Speaker updated successfully.", "success");
    } else {
      await addSpeaker(payload);
      showAlert("Speaker added successfully.", "success");
    }
    resetForm();
    await loadData();
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save speaker.", "error");
  }
};

const handleDelete = async (id) => {
  // We explicitly use window.confirm to avoid Nuxt SSR confusion
  if (!window.confirm("Are you sure you want to delete this speaker?")) return;

  try {
    await deleteSpeaker(id);

    // Optimistically update the UI without needing to refetch
    speakers.value = speakers.value.filter((item) => item.id !== id);
    if (speakerForm.value.id === id) resetForm();

    showAlert("Speaker removed successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to delete speaker.", "error");
  }
};

onMounted(() => {
  loadData();
});
</script>
