<template>
  <div class="max-w-4xl mx-auto pb-24 md:pb-0 font-montserrat animate-fade-in">
    <header class="gap-4 mb-6 pb-6 mt-7 px-3">
      <div>
        <h1
          class="text-xl font-bold text-gray-900 uppercase tracking-tight mb-1"
        >
          Manual Dinner Entry
        </h1>
        <p class="text-sm font-medium text-gray-500">
          Directly add a workers dinner registration into the database.
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
              >Email Address *</label
            >
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="jane@example.com"
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
              >Chapel Unit *</label
            >
            <select
              v-model="formData.unit"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="" disabled>Select unit...</option>
              <option value="Academic">Academic</option>
              <option value="Bible Study">Bible Study</option>
              <option value="Brothers">Brothers</option>
              <option value="Choir">Choir</option>
              <option value="Drama">Drama</option>
              <option value="Editorial">Editorial</option>
              <option value="Evangelism">Evangelism</option>
              <option value="Media">Media</option>
              <option value="Prayer">Prayer</option>
              <option value="Protocol">Protocol</option>
              <option value="Sisters">Sisters</option>
              <option value="Technical">Technical</option>
              <option value="Ushering">Ushering</option>
              <option value="Welfare">Welfare</option>
            </select>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >Preferred Table *</label
            >
            <select
              v-model="formData.tableChoice"
              required
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="" disabled>Select table tribe...</option>
              <option value="Love Tribe">Love Tribe</option>
              <option value="Healing Tribe">Healing Tribe</option>
              <option value="Fire Tribe">Fire Tribe</option>
              <option value="Grace Tribe">Grace Tribe</option>
              <option value="Joy Tribe">Joy Tribe</option>
              <option value="Peace Tribe">Peace Tribe</option>
              <option value="Light Tribe">Light Tribe</option>
              <option value="Bond Tribe">Bond Tribe</option>
            </select>
          </div>
        </div>

        <div class="space-y-6 mt-6">
          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >Most unique thing about the person
            </label>
            <textarea
              v-model="formData.uniqueThing"
              rows="2"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
              placeholder="Your answer..."
            ></textarea>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-black uppercase tracking-wider mb-2"
              >His/Her expectation for dinner</label
            >
            <textarea
              v-model="formData.expectation"
              rows="2"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
              placeholder="Your answer..."
            ></textarea>
          </div>
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
  email: "",
  whatsapp: "",
  unit: "",
  tableChoice: "",
  uniqueThing: "",
  expectation: "",
  approveImmediately: false,
});

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    whatsapp: "",
    unit: "",
    tableChoice: "",
    uniqueThing: "",
    expectation: "",
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
    email: formData.value.email.trim(),
    whatsapp: formData.value.whatsapp.trim(),
    unit: formData.value.unit,
    tableChoice: formData.value.tableChoice,
    uniqueThing: formData.value.uniqueThing.trim(),
    expectation: formData.value.expectation.trim(),
    status: finalStatus,
    reviewer: authStore.user?.email || "Manual Admin Entry",
  };

  try {
    // Calling the dynamic endpoint we built previously
    await $fetch(`${config.public.apiBase}/applications/dinner/manual`, {
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
