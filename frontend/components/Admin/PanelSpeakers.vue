<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="font-display text-4xl font-bold text-white tracking-tight mb-2 uppercase"
      >
        Speakers
      </h2>
      <p class="text-gray-400">
        Manage keynote speakers, ministerial roles, and session topics for 2026.
      </p>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-if="speakers.length === 0"
          class="border-2 border-dashed border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-500 bg-gray-900/50"
        >
          <Icon name="heroicons:user-plus" class="w-12 h-12 mb-4 opacity-50" />
          <p class="font-medium tracking-wide">
            {{ loading ? "Loading speakers..." : "No speakers added yet." }}
          </p>
        </div>

        <div
          v-else
          v-for="speaker in speakers"
          :key="speaker.id"
          class="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 transition-all hover:border-gray-700 hover:shadow-xl"
        >
          <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <div
            class="flex flex-col sm:flex-row items-start justify-between gap-6"
          >
            <div class="flex gap-5 items-start">
              <div
                class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden shadow-lg border border-gray-700 shrink-0 bg-gray-950"
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
                  class="w-full h-full p-4 text-gray-600"
                />
              </div>
              <div>
                <h3
                  class="font-display text-xl font-bold text-white mb-1 uppercase"
                >
                  {{ speaker.name }}
                </h3>
                <p
                  class="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3"
                >
                  {{ speaker.role || "No Role Specified" }}
                </p>
                <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Icon name="heroicons:academic-cap" class="w-4 h-4" />
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
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-xs font-semibold uppercase tracking-wider border border-gray-700"
              >
                <Icon name="heroicons:pencil-square" class="w-4 h-4" /> Edit
              </button>
              <button
                @click="handleDelete(speaker.id)"
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider border border-red-900/30"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          class="sticky top-10 rounded-2xl bg-gray-900 p-6 sm:p-8 border border-gray-800 shadow-2xl"
        >
          <h3
            class="font-display text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide"
          >
            <Icon
              name="heroicons:pencil-square"
              class="text-orange-500 w-6 h-6"
            />
            {{ speakerForm.id ? "Edit Speaker" : "Add New Speaker" }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                >Full Name *</label
              >
              <input
                v-model="speakerForm.name"
                type="text"
                required
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                placeholder="e.g. Dr. Jane Doe"
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                >Role / Designation</label
              >
              <input
                v-model="speakerForm.role"
                type="text"
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                placeholder="Keynote Speaker"
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                >Topic</label
              >
              <input
                v-model="speakerForm.topic"
                type="text"
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                placeholder="Enter session title"
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                >Image URL</label
              >
              <input
                v-model="speakerForm.image"
                type="text"
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                placeholder="/img/speaker.jpg"
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                >Biography</label
              >
              <textarea
                v-model="speakerForm.bio"
                rows="3"
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm resize-none"
              ></textarea>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 py-3 rounded-xl text-black font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
              >
                Save Profile
              </button>
              <button
                v-if="speakerForm.id"
                @click="resetForm"
                type="button"
                class="px-6 bg-gray-800 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs border border-gray-700 hover:bg-gray-700 transition-all"
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

const { getSpeakers } = useConferenceData();
const { addSpeaker, updateSpeaker, deleteSpeaker } = useAdminMutations();

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
    const { data } = await getSpeakers();
    speakers.value = Array.isArray(data.value) ? data.value : [];
  } catch (error) {
    alert("Failed to load speakers.");
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
    } else {
      await addSpeaker(payload);
    }
    resetForm();
    await loadData();
  } catch (error) {
    alert("Failed to save speaker.");
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;
  try {
    await deleteSpeaker(id);
    speakers.value = speakers.value.filter((item) => item.id !== id);
    if (speakerForm.value.id === id) resetForm();
  } catch (error) {
    alert("Failed to delete speaker.");
  }
};

onMounted(() => {
  loadData();
});
</script>
