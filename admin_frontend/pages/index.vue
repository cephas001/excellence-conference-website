<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-10">
      <h1
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Welcome back, {{ name }}
      </h1>
      <p class="text-base text-gray-500 font-medium">
        Here's your mission control for Excellence Conference. What are we
        working on today?
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <div
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col"
      >
        <div class="flex items-center gap-4 mb-4">
          <div
            class="bg-orange-50 text-orange-600 p-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-black">Workers Dinner</h3>
        </div>

        <p class="text-sm text-gray-500 mb-8 leading-relaxed grow">
          Review table reservations, verify payment receipts, and manage the
          guest list for the upcoming dinner event.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-auto">
          <NuxtLink
            to="/dinner"
            class="flex-1 bg-black text-white text-center py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Review Queue
          </NuxtLink>
          <NuxtLink
            to="/dinner/analytics"
            class="flex-1 bg-gray-50 text-gray-700 text-center py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            View Analytics
          </NuxtLink>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col"
      >
        <div class="flex items-center gap-4 mb-4">
          <div
            class="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-black">EC Merch</h3>
        </div>

        <p class="text-sm text-gray-500 mb-8 leading-relaxed grow">
          Verify merchandise payments, track sizing requirements, and monitor
          inventory distribution and revenue.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-auto">
          <NuxtLink
            to="/merch"
            class="flex-1 bg-black text-white text-center py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Review Queue
          </NuxtLink>
          <NuxtLink
            to="/merch/analytics"
            class="flex-1 bg-gray-50 text-gray-700 text-center py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            View Analytics
          </NuxtLink>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col"
      >
        <div class="flex items-center gap-4 mb-4">
          <div
            class="bg-purple-50 text-purple-600 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-black">Website Content</h3>
        </div>

        <p class="text-sm text-gray-500 mb-8 leading-relaxed grow">
          Manage landing page sections, update conference information, and
          control the visibility of forms and modules.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-auto">
          <NuxtLink
            to="/website"
            class="flex-1 bg-black text-white text-center py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Manage Pages
          </NuxtLink>
          <NuxtLink
            to="/website/analytics"
            class="flex-1 bg-gray-50 text-gray-700 text-center py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Website Analytics
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const name = computed(() => auth.user?.name?.split(" ")[0] || "Administrator");
</script>
