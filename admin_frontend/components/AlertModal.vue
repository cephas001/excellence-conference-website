<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        @click="closeAlert"
      ></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all p-6 text-center animate-fade-in-up"
      >
        <div
          class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5"
          :class="theme.bgClass"
        >
          <svg
            v-if="type === 'success'"
            class="h-7 w-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <svg
            v-else-if="type === 'error'"
            class="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <svg
            v-else
            class="h-7 w-7 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 mb-6 leading-relaxed">
          {{ message }}
        </p>

        <button
          @click="closeAlert"
          class="w-full inline-flex justify-center rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          :class="theme.btnClass"
        >
          Okay
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { useAlertModal } from "~/composables/useAlertModal";

const { isOpen, title, message, type, closeAlert } = useAlertModal();

// Dynamically compute the colors based on the alert type
const theme = computed(() => {
  switch (type.value) {
    case "success":
      return {
        bgClass: "bg-green-100",
        btnClass: "bg-green-600 hover:bg-green-700 focus:ring-green-600",
      };
    case "error":
      return {
        bgClass: "bg-red-100",
        btnClass: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
      };
    case "warning":
    case "info":
    default:
      return {
        bgClass: "bg-amber-100",
        btnClass: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-600",
      };
  }
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
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
