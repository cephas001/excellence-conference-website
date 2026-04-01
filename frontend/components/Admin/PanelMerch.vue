<template>
  <div class="animate-fade-in">
    <header class="mb-10">
      <h2
        class="font-display text-4xl font-bold text-theme-text tracking-tight mb-2 uppercase"
      >
        Merchandise
      </h2>
      <p class="text-theme-text-muted">
        Manage the online store catalog and payment instructions.
      </p>
    </header>

    <section
      class="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 mb-8"
    >
      <h3 class="font-display text-xl font-bold text-theme-text mb-4 uppercase">
        Payment & Order Config
      </h3>
      <form
        @submit.prevent="handleSettingsSubmit"
        class="grid sm:grid-cols-2 gap-4"
      >
        <div>
          <label
            class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
            >Bank Name</label
          >
          <input
            v-model="merchSettings.accountBank"
            type="text"
            class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
          />
        </div>
        <div>
          <label
            class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
            >Account Number</label
          >
          <input
            v-model="merchSettings.accountNumber"
            type="text"
            class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
          />
        </div>
        <div>
          <label
            class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
            >Account Name</label
          >
          <input
            v-model="merchSettings.accountName"
            type="text"
            class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
          />
        </div>
        <div>
          <label
            class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
            >Google Form Link</label
          >
          <input
            v-model="merchSettings.googleFormLink"
            type="url"
            class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
          />
        </div>
        <div class="sm:col-span-2 pt-2">
          <button
            type="submit"
            class="bg-gray-800 text-theme-text px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-700 hover:bg-gray-700"
          >
            Save Config
          </button>
        </div>
      </form>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section class="xl:col-span-8 space-y-4">
        <div
          v-for="item in merchItems"
          :key="item.id"
          class="flex flex-col sm:flex-row items-center gap-4 bg-theme-surface border border-theme-border rounded-2xl p-4"
        >
          <div
            class="w-20 h-20 bg-theme-base rounded-lg border border-theme-border shrink-0 overflow-hidden"
          >
            <img
              v-if="item.image"
              :src="item.image"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-grow text-center sm:text-left">
            <h3 class="font-bold text-theme-text uppercase">{{ item.name }}</h3>
            <p class="text-theme-primary font-bold text-sm">{{ item.price }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="editMerch(item)"
              class="px-4 py-2 rounded-lg bg-gray-800 text-theme-text-muted text-xs font-semibold uppercase border border-gray-700"
            >
              Edit
            </button>
            <button
              @click="handleDelete(item.id)"
              class="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-semibold uppercase border border-red-900/30"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-4">
        <div
          class="sticky top-10 rounded-2xl bg-theme-surface p-6 border border-theme-border shadow-2xl"
        >
          <h3
            class="font-display text-xl font-bold text-theme-text mb-6 uppercase tracking-wide"
          >
            {{ merchForm.id ? "Edit Product" : "Add Product" }}
          </h3>
          <form @submit.prevent="handleMerchSubmit" class="space-y-4">
            <div>
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
                >Product Name</label
              >
              <input
                v-model="merchForm.name"
                type="text"
                required
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
              />
            </div>
            <div>
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
                >Price (â‚¦)</label
              >
              <input
                v-model="merchForm.price"
                type="text"
                required
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
                placeholder="e.g. â‚¦15,000"
              />
            </div>
            <div>
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
                >Image URL</label
              >
              <input
                v-model="merchForm.image"
                type="text"
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1"
              />
            </div>
            <div>
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted"
                >Description</label
              >
              <textarea
                v-model="merchForm.description"
                rows="2"
                class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3 text-theme-text text-sm mt-1 resize-none"
              ></textarea>
            </div>
            <div class="pt-2 flex gap-3">
              <button
                type="submit"
                class="flex-1 bg-theme-primary text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                Save
              </button>
              <button
                v-if="merchForm.id"
                @click="resetForm"
                type="button"
                class="px-6 bg-gray-800 text-theme-text rounded-xl font-bold uppercase text-xs border border-gray-700"
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

const { getMerch, getMerchSettings } = useConferenceData();
const { addMerchItem, updateMerchItem, deleteMerchItem, updateMerchSettings } =
  useAdminMutations();

const merchItems = ref([]);
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
  image: "",
  order: 0,
});

const normalizeMerchItem = (item = {}) => {
  const image = Array.isArray(item.images)
    ? item.images[0] || ""
    : item.image || "";
  return { ...item, image };
};

const loadData = async () => {
  try {
    const [merchData, settingsData] = await Promise.all([
      getMerch(),
      getMerchSettings(),
    ]);
    merchItems.value = (
      Array.isArray(merchData.data.value) ? merchData.data.value : []
    ).map(normalizeMerchItem);

    if (settingsData.data.value) {
      merchSettings.value = {
        accountBank: settingsData.data.value.accountBank || "",
        accountNumber: settingsData.data.value.accountNumber || "",
        accountName: settingsData.data.value.accountName || "",
        googleFormLink: settingsData.data.value.googleFormLink || "",
      };
    }
  } catch (error) {
    console.error("Failed to load merch data", error);
  }
};

const handleSettingsSubmit = async () => {
  try {
    await updateMerchSettings({ ...merchSettings.value });
    alert("Payment details saved.");
  } catch (error) {
    alert("Failed to save payment details.");
  }
};

const resetForm = () => {
  merchForm.value = {
    id: "",
    name: "",
    price: "",
    description: "",
    image: "",
    order: 0,
  };
};

const editMerch = (item) => {
  merchForm.value = {
    ...item,
    order: Number.isFinite(item.order) ? item.order : 0,
  };
};

const handleMerchSubmit = async () => {
  const image = merchForm.value.image.trim();
  const payload = {
    name: merchForm.value.name.trim(),
    price: merchForm.value.price.trim(),
    description: merchForm.value.description.trim(),
    images: image ? [image] : [],
    order: Number.isFinite(merchForm.value.order)
      ? merchForm.value.order
      : merchItems.value.length,
  };

  try {
    if (merchForm.value.id) {
      await updateMerchItem(merchForm.value.id, payload);
    } else {
      await addMerchItem(payload);
    }
    resetForm();
    await loadData();
  } catch (error) {
    alert("Failed to save merch item.");
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;
  try {
    await deleteMerchItem(id);
    merchItems.value = merchItems.value.filter((item) => item.id !== id);
    if (merchForm.value.id === id) resetForm();
  } catch (error) {
    alert("Failed to delete merch item.");
  }
};

onMounted(() => loadData());
</script>
