<template>
  <div class="max-w-4xl mx-auto pb-24 md:pb-0 font-montserrat animate-fade-in">
    <header class="gap-4 mb-6 pb-6 mt-7 px-3">
      <div>
        <h1
          class="text-xl font-bold text-gray-900 uppercase tracking-tight mb-1"
        >
          Manual Merch Entry
        </h1>
        <p class="text-sm font-medium text-gray-500">
          Directly add a merchandise order into the database.
        </p>
      </div>
    </header>

    <section
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >Full Name *</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >WhatsApp Number *</label
            >
            <input
              v-model="formData.whatsapp"
              type="tel"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="080..."
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >Level *</label
            >
            <select
              v-model="formData.level"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="" disabled>Select level...</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="JUPEB">JUPEB</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >Package *</label
            >
            <select
              v-model="formData.package"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="" disabled>Select package...</option>
              <option value="Standard (T-shirt, Jotter)">
                Standard (T-shirt, Jotter) - ₦7,000
              </option>
              <option value="Only T-Shirt">Only T-Shirt - ₦5,000</option>
            </select>
          </div>

          <template v-if="formData.package">
            <div>
              <label
                class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
                >Color of T-Shirt *</label
              >
              <select
                v-model="formData.color"
                required
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="" disabled>Select color...</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Blue">Blue</option>
                <option value="Wine">Wine</option>
                <option value="Brown">Brown</option>
              </select>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
                >Size of T-Shirt *</label
              >
              <select
                v-model="formData.size"
                required
                class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="" disabled>Select size...</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>
          </template>
        </div>

        <hr class="border-gray-100 my-6" />

        <div class="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
          <label class="flex items-start gap-3 cursor-pointer group">
            <div
              class="relative flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
            >
              <input
                type="checkbox"
                v-model="formData.approveImmediately"
                class="peer sr-only"
              />
              <div
                class="absolute inset-0 bg-white border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"
              ></div>
              <svg
                class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity z-10"
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
            <div>
              <span class="block text-sm font-bold text-gray-900 mb-1"
                >Approve Immediately</span
              >
              <span class="block text-xs text-gray-500 font-medium mt-0.5"
                >The row will be injected into Google Sheets with the "Approved"
                status instantly.</span
              >
            </div>
          </label>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg
              v-if="isSubmitting"
              class="w-4 h-4 animate-spin text-white opacity-80"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSubmitting ? "Saving..." : "Submit" }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAlertModal } from "~/composables/useAlertModal";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";

const { showAlert } = useAlertModal();
const config = useRuntimeConfig();
const token = useCookie("ec_token");
const authStore = useAuthStore();

const isSubmitting = ref(false);

const formData = ref({
  name: "",
  level: "",
  whatsapp: "",
  package: "",
  color: "",
  size: "",
  approveImmediately: false,
});

const resetForm = () => {
  formData.value = {
    name: "",
    level: "",
    whatsapp: "",
    package: "",
    color: "",
    size: "",
    approveImmediately: false,
  };
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  const finalStatus = formData.value.approveImmediately ? "Approved" : "";

  // Format the current date exactly like Google Forms does: "M/D/YYYY H:MM:SS"
  const now = new Date();
  const timestamp = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  const payload = {
    timestamp,
    name: formData.value.name.trim(),
    level: formData.value.level,
    whatsapp: formData.value.whatsapp.trim(),
    package: formData.value.package,
    color: formData.value.color,
    size: formData.value.size,
    status: finalStatus,
    reviewer: authStore.user?.email || "Manual Admin Entry",
  };

  try {
    await $fetch(`${config.public.apiBase}/applications/merch/manual`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: payload,
    });

    showAlert(
      "Manual entry appended to Google Sheets successfully!",
      "success",
    );
    resetForm();
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to add manual entry.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
