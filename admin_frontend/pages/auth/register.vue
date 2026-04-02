<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative"
    >
      <NuxtLink
        to="/"
        class="absolute top-5 left-1/2 -translate-x-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </NuxtLink>

      <div class="text-center mb-8 mt-4">
        <h2 class="text-2xl font-bold text-black">Excellence Conference</h2>
        <p class="text-md text-gray-700 mt-2">Register New Administrator</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-black mb-1"
            >Full Name</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-black mb-1"
            >Email</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-black mb-1"
            >Password</label
          >

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
              placeholder="••••••••"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black focus:outline-none"
            >
              <svg
                v-if="!showPassword"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>

              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label
            for="adminType"
            class="block text-sm font-medium text-black mb-1"
          >
            Admin Type
          </label>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <select
              id="adminType"
              v-model="formData.type"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black appearance-none"
            >
              <option value="" disabled selected>Select Admin Type</option>
              <option value="Dinner">Dinner</option>
              <option value="Merch">Merch</option>
              <option value="All">All</option>
              <option value="None">None</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <IconsLoader width="4" height="4" class="mr-2" v-if="loading" />
          {{ loading ? "Creating account..." : "Register Administrator" }}
        </button>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 mt-3">
          <div class="flex">
            <div class="shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm text-red-800">{{ errorMessage }}</h3>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-3 mt-3">
          <div class="flex">
            <div class="shrink-0">
              <svg
                class="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm text-green-800">{{ successMessage }}</h3>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

const formData = ref({
  name: "",
  email: "",
  password: "",
  type: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  formData.value.type = formData.value.type.toLowerCase(); // Ensure type is lowercase

  try {
    const response = await $fetch(`${config.public.apiBase}/auth/register`, {
      method: "POST",
      body: formData.value,
    });

    successMessage.value = "Administrator successfully registered!";

    // Clear the form
    formData.value = { name: "", email: "", password: "", type: "" };
  } catch (error) {
    console.log(error);
    errorMessage.value =
      error.data?.error || "An error occurred during registration.";
  } finally {
    loading.value = false;
  }
};
</script>
