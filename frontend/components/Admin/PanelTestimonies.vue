<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="font-display text-4xl font-bold text-theme-text tracking-tight mb-2 uppercase"
      >
        Testimonies
      </h2>
      <p class="text-theme-text-muted">
        Manage attendee testimonies shown on the home page.
      </p>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-if="testimonies.length === 0"
          class="border-2 border-dashed border-theme-border rounded-2xl p-12 flex flex-col items-center justify-center text-theme-text-muted bg-theme-surface/50"
        >
          <Icon
            name="heroicons:chat-bubble-bottom-center-text"
            class="w-12 h-12 mb-4 opacity-50"
          />
          <p class="font-medium tracking-wide">
            {{ loading ? "Loading..." : "No testimonies added yet." }}
          </p>
        </div>

        <div
          v-else
          v-for="testimony in testimonies"
          :key="testimony.id"
          class="group relative overflow-hidden rounded-2xl bg-theme-surface border border-theme-border p-6 transition-all hover:border-gray-700"
        >
          <div
            class="flex flex-col sm:flex-row items-start justify-between gap-6"
          >
            <div>
              <h3
                class="font-display text-xl font-bold text-theme-text mb-1 uppercase"
              >
                {{ testimony.name }}
              </h3>
              <p
                class="text-theme-primary text-xs font-bold tracking-widest uppercase mb-3"
              >
                {{ testimony.location }}
              </p>
              <p
                class="text-theme-text-muted text-sm italic border-l-2 border-gray-700 pl-3"
              >
                "{{ testimony.testimony }}"
              </p>
            </div>
            <div class="flex sm:flex-col gap-2 shrink-0">
              <button
                @click="editTestimony(testimony)"
                class="px-4 py-2 rounded-lg bg-gray-800 text-theme-text-muted text-xs font-semibold uppercase border border-gray-700"
              >
                Edit
              </button>
              <button
                @click="handleDelete(testimony.id)"
                class="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-semibold uppercase border border-red-900/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          class="sticky top-10 rounded-2xl bg-theme-surface p-6 sm:p-8 border border-theme-border shadow-2xl"
        >
          <h3
            class="font-display text-xl font-bold text-theme-text mb-6 flex items-center gap-2 uppercase tracking-wide"
          >
            <Icon
              name="heroicons:pencil-square"
              class="text-theme-primary w-6 h-6"
            />
            {{ testimonyForm.id ? "Edit Testimony" : "Add Testimony" }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1"
                >Name *</label
              >
              <input
                v-model="testimonyForm.name"
                type="text"
                required
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1"
                >Year / Location</label
              >
              <input
                v-model="testimonyForm.location"
                type="text"
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm"
                placeholder="e.g. 2025 Attendee"
              />
            </div>
            <div class="space-y-1.5">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1"
                >Quote *</label
              >
              <textarea
                v-model="testimonyForm.testimony"
                required
                rows="4"
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm resize-none"
              ></textarea>
            </div>
            <div class="pt-4 flex gap-3">
              <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary py-3 rounded-xl text-black font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
              >
                Save
              </button>
              <button
                v-if="testimonyForm.id"
                @click="resetForm"
                type="button"
                class="px-6 bg-gray-800 py-3 rounded-xl text-theme-text font-bold uppercase tracking-widest text-xs border border-gray-700"
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

const { getTestimonies } = useConferenceData();
const { addTestimony, updateTestimony, deleteTestimony } = useAdminMutations();

const testimonies = ref([]);
const loading = ref(true);
const testimonyForm = ref({ id: "", name: "", location: "", testimony: "" });

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await getTestimonies();
    testimonies.value = Array.isArray(data.value) ? data.value : [];
  } catch (error) {
    alert("Failed to load testimonies.");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  testimonyForm.value = { id: "", name: "", location: "", testimony: "" };
};

const editTestimony = (testimony) => {
  testimonyForm.value = { ...testimony };
};

const handleSubmit = async () => {
  const payload = {
    name: testimonyForm.value.name.trim(),
    location: testimonyForm.value.location.trim(),
    testimony: testimonyForm.value.testimony.trim(),
  };

  try {
    if (testimonyForm.value.id) {
      await updateTestimony(testimonyForm.value.id, payload);
    } else {
      await addTestimony(payload);
    }
    resetForm();
    await loadData();
  } catch (error) {
    alert("Failed to save testimony.");
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;
  try {
    await deleteTestimony(id);
    testimonies.value = testimonies.value.filter((item) => item.id !== id);
    if (testimonyForm.value.id === id) resetForm();
  } catch (error) {
    alert("Failed to delete testimony.");
  }
};

onMounted(() => loadData());
</script>
