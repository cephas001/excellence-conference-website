<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Merchandise Store
      </h2>
      <p class="text-sm text-gray-500 font-medium">
        Manage the online store catalog and payment instructions.
      </p>
    </header>

    <section
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8"
    >
      <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">
        Payment & Order Config
      </h3>
      <form
        @submit.prevent="handleSettingsSubmit"
        class="grid sm:grid-cols-2 gap-4"
      >
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >Bank Name</label
          >
          <input
            v-model="merchSettings.accountBank"
            type="text"
            class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >Account Number</label
          >
          <input
            v-model="merchSettings.accountNumber"
            type="text"
            class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >Account Name</label
          >
          <input
            v-model="merchSettings.accountName"
            type="text"
            class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >Google Form Link</label
          >
          <input
            v-model="merchSettings.googleFormLink"
            type="url"
            class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-white"
          />
        </div>
        <div class="sm:col-span-2 pt-4">
          <button
            type="submit"
            class="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-for="item in merchItems"
          :key="item.id"
          class="flex flex-col sm:flex-row items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
        >
          <div
            class="relative w-full sm:w-32 h-40 sm:h-32 bg-gray-50 rounded-xl border border-gray-200 shrink-0 overflow-hidden group"
          >
            <div
              class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full scroll-smooth"
            >
              <div
                v-if="!item.images || item.images.length === 0"
                class="flex-none w-full h-full flex items-center justify-center text-gray-300"
              >
                <Icon name="heroicons:photo" class="w-8 h-8" />
              </div>
              <img
                v-else
                v-for="(img, idx) in item.images"
                :key="idx"
                :src="img"
                class="flex-none w-full h-full object-cover snap-center"
              />
            </div>
            <div
              v-if="item.images && item.images.length > 1"
              class="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none tracking-wider"
            >
              {{ item.images.length }} PHOTOS
            </div>
          </div>

          <div class="flex-grow text-center sm:text-left w-full sm:w-auto">
            <h3 class="font-bold text-gray-900 uppercase text-sm mb-1">
              {{ item.name }}
            </h3>
            <p class="text-gray-500 font-semibold text-sm">{{ item.price }}</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto justify-center">
            <button
              @click="editMerch(item)"
              class="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 text-xs font-semibold uppercase transition-colors"
            >
              Edit
            </button>
            <button
              @click="handleDelete(item.id)"
              class="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-semibold uppercase transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          ref="formContainerRef"
          class="sticky top-10 rounded-2xl bg-white p-6 sm:p-8 border border-gray-100 shadow-lg"
        >
          <h3
            class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6"
          >
            {{ merchForm.id ? "Edit Product" : "Add Product" }}
          </h3>
          <form @submit.prevent="handleMerchSubmit" class="space-y-4">
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Product Name</label
              >
              <input
                v-model="merchForm.name"
                type="text"
                required
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Price (₦)</label
              >
              <input
                v-model="merchForm.price"
                type="text"
                required
                placeholder="e.g. ₦15,000"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
              />
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Image URLs</label
              >
              <div class="space-y-2">
                <div
                  v-for="(img, idx) in merchForm.images"
                  :key="idx"
                  class="flex gap-2 relative"
                >
                  <input
                    v-model="merchForm.images[idx]"
                    type="url"
                    placeholder="https://.../image.jpg"
                    class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all pr-10"
                  />
                  <button
                    v-if="merchForm.images.length > 1"
                    @click.prevent="removeImageInput(idx)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-1"
                  >
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                @click.prevent="addImageInput"
                class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider mt-3 flex items-center gap-1 transition-colors"
              >
                <Icon name="heroicons:plus-circle" class="w-4 h-4" /> Add
                another image
              </button>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >Description</label
              >
              <textarea
                v-model="merchForm.description"
                rows="2"
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div class="pt-2 flex gap-3">
              <button
                type="submit"
                class="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-900 transition-colors"
              >
                Save
              </button>
              <button
                v-if="merchForm.id"
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

const { getMerch, getMerchSettings } = useConferenceData();
const { addMerchItem, updateMerchItem, deleteMerchItem, updateMerchSettings } =
  useAdminMutations();
const { showAlert } = useAlertModal();

const merchItems = ref([]);
const formContainerRef = ref(null); // Reference for auto-scrolling

const merchSettings = ref({
  accountBank: "",
  accountNumber: "",
  accountName: "",
  googleFormLink: "",
});

const merchForm = ref({
  id: "",
  name: "",
  price: "",
  description: "",
  images: [""], // Initialized as an array with one empty slot
  order: 0,
});

// Ensures the component always works with an array, regardless of old database entries
const normalizeMerchItem = (item = {}) => {
  const images = Array.isArray(item.images)
    ? item.images
    : item.image
      ? [item.image]
      : [];
  return { ...item, images };
};

const loadData = async () => {
  try {
    const [merchResponse, settingsResponse] = await Promise.all([
      getMerch(),
      getMerchSettings(),
    ]);

    const merchDataArray = Array.isArray(merchResponse) ? merchResponse : [];
    merchItems.value = merchDataArray.map(normalizeMerchItem);

    const settingsObj = settingsResponse.data || settingsResponse;
    if (settingsObj) {
      merchSettings.value = {
        accountBank: settingsObj.accountBank || "",
        accountNumber: settingsObj.accountNumber || "",
        accountName: settingsObj.accountName || "",
        googleFormLink: settingsObj.googleFormLink || "",
      };
    }
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert("Failed to load merch data.", "error");
  }
};

const handleSettingsSubmit = async () => {
  try {
    await updateMerchSettings({ ...merchSettings.value });
    showAlert("Payment details saved successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save payment details.", "error");
  }
};

// Functions to handle the dynamic Image Inputs
const addImageInput = () => {
  merchForm.value.images.push("");
};

const removeImageInput = (index) => {
  merchForm.value.images.splice(index, 1);
};

const resetForm = () => {
  merchForm.value = {
    id: "",
    name: "",
    price: "",
    description: "",
    images: [""], // Reset to a single empty input
    order: 0,
  };
};

const editMerch = async (item) => {
  merchForm.value = {
    ...item,
    // Populate with existing images or default to one empty slot
    images: item.images && item.images.length > 0 ? [...item.images] : [""],
    order: Number.isFinite(item.order) ? item.order : 0,
  };

  // Wait for the DOM to update, then smoothly scroll the user to the form
  await nextTick();
  if (formContainerRef.value) {
    formContainerRef.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const handleMerchSubmit = async () => {
  // Clean up the array by removing any blank inputs the user left behind
  const cleanImages = merchForm.value.images
    .map((img) => img.trim())
    .filter((img) => img !== "");

  const payload = {
    name: merchForm.value.name.trim(),
    price: merchForm.value.price.trim(),
    description: merchForm.value.description.trim(),
    images: cleanImages,
    order: Number.isFinite(merchForm.value.order)
      ? merchForm.value.order
      : merchItems.value.length,
  };

  try {
    if (merchForm.value.id) {
      await updateMerchItem(merchForm.value.id, payload);
      showAlert("Merch item updated successfully.", "success");
    } else {
      await addMerchItem(payload);
      showAlert("Merch item added successfully.", "success");
    }
    resetForm();
    await loadData();
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save merch item.", "error");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  try {
    await deleteMerchItem(id);
    merchItems.value = merchItems.value.filter((item) => item.id !== id);
    if (merchForm.value.id === id) resetForm();
    showAlert("Merch item removed successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to delete merch item.", "error");
  }
};

onMounted(() => loadData());
</script>
