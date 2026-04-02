<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Testimonies
      </h2>
      <p class="text-sm text-gray-500 font-medium">
        Manage attendee testimonies shown on the home page.
      </p>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-if="testimonies.length === 0"
          class="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50"
        >
          <Icon
            name="heroicons:chat-bubble-bottom-center-text"
            class="w-12 h-12 mb-4 text-gray-300"
          />
          <p class="text-sm font-medium">
            {{ loading ? "Loading..." : "No testimonies added yet." }}
          </p>
        </div>

        <div
          v-else
          v-for="testimony in testimonies"
          :key="testimony.id"
          class="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div
            class="flex flex-col sm:flex-row items-start justify-between gap-6"
          >
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-1">
                {{ testimony.name }}
              </h3>
              <p
                class="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4"
              >
                {{ testimony.location }}
              </p>
              <p
                class="text-gray-600 text-sm italic border-l-2 border-gray-300 pl-4 py-1 leading-relaxed"
              >
                "{{ testimony.testimony }}"
              </p>
            </div>
            <div
              class="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
            >
              <button
                @click="editTestimony(testimony)"
                class="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 text-xs font-semibold uppercase transition-colors"
              >
                Edit
              </button>
              <button
                @click="handleDelete(testimony.id)"
                class="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-semibold uppercase transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          ref="formContainerRef"
          class="sticky top-10 rounded-2xl bg-white p-6 sm:p-8 border border-gray-100 shadow-lg"
        >
          <h3
            class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <Icon
              name="heroicons:pencil-square"
              class="text-gray-400 w-5 h-5"
            />
            {{ testimonyForm.id ? "Edit Testimony" : "Add Testimony" }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Name *</label
              >
              <input
                v-model="testimonyForm.name"
                type="text"
                required
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Year / Location</label
              >
              <input
                v-model="testimonyForm.location"
                type="text"
                placeholder="e.g. 2025 Attendee"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Quote *</label
              >
              <textarea
                v-model="testimonyForm.testimony"
                required
                rows="4"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div class="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                class="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-900 transition-colors"
              >
                Save
              </button>
              <button
                v-if="testimonyForm.id"
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
import { ref, onMounted, nextTick } from "vue";
import { useAlertModal } from "~/composables/useAlertModal";

// Ensure auto-imports are working or manually import your composables
const { getTestimonies } = useConferenceData();
const { addTestimony, updateTestimony, deleteTestimony } = useAdminMutations();
const { showAlert } = useAlertModal();

const testimonies = ref([]);
const loading = ref(true);
const testimonyForm = ref({ id: "", name: "", location: "", testimony: "" });

// 1. Initialize the ref for the form container
const formContainerRef = ref(null);

const loadData = async () => {
  loading.value = true;
  try {
    const response = await getTestimonies();
    // Check the response directly since it's already the array!
    testimonies.value = Array.isArray(response) ? response : [];
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert("Failed to load testimonies.", "error");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  testimonyForm.value = { id: "", name: "", location: "", testimony: "" };
};

// 2. Make editTestimony async and add the scroll logic
const editTestimony = async (testimony) => {
  testimonyForm.value = { ...testimony };

  // Wait for the Vue reactivity cycle to finish, then scroll down
  await nextTick();
  if (formContainerRef.value) {
    formContainerRef.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
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
      showAlert("Testimony updated successfully.", "success");
    } else {
      await addTestimony(payload);
      showAlert("Testimony added successfully.", "success");
    }
    resetForm();
    await loadData();
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save testimony.", "error");
  }
};

const handleDelete = async (id) => {
  // Use explicit window.confirm to avoid Nuxt SSR confusion
  if (!window.confirm("Are you sure you want to delete this testimony?"))
    return;

  try {
    await deleteTestimony(id);
    testimonies.value = testimonies.value.filter((item) => item.id !== id);
    if (testimonyForm.value.id === id) resetForm();
    showAlert("Testimony removed successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to delete testimony.", "error");
  }
};

onMounted(() => loadData());
</script>
