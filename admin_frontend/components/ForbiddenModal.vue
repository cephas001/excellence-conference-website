<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all p-6 sm:p-8 text-center animate-fade-in-up"
      >
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6"
        >
          <svg
            class="h-8 w-8 text-red-500"
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

        <h3 class="text-xl font-bold text-gray-900 font-montserrat mb-2">
          {{ errorTitle }}
        </h3>
        <p class="text-sm text-gray-500 mb-8 leading-relaxed">
          {{ errorMessage }}
        </p>

        <button
          @click="closeModal"
          class="w-full inline-flex justify-center rounded-xl border border-transparent bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          Understood
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useErrorModal } from "~/composables/useErrorModal";

const { isOpen, errorMessage, errorTitle, closeModal } = useErrorModal();
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
