<template>
  <div class="fixed bottom-10 right-10 z-50 flex flex-col items-end">
    <transition name="fab-menu">
      <div v-if="showFabMenu" class="flex flex-col items-end space-y-4 mb-4">
        <button
          v-if="showApproveReject"
          @click="handleAction('approve')"
          :disabled="disabled"
          class="flex items-center group disabled:opacity-50"
        >
          <span
            class="mr-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >Approve</span
          >
          <div
            class="bg-black text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <IconsTick />
          </div>
        </button>

        <button
          v-if="showApproveReject"
          @click="handleAction('reject')"
          :disabled="disabled"
          class="flex items-center group disabled:opacity-50"
        >
          <span
            class="mr-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >Reject</span
          >
          <div
            class="bg-white border-2 border-red-100 text-red-600 p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <IconsCancel />
          </div>
        </button>

        <button
          @click="handleAction('toggle-details')"
          class="flex items-center group"
        >
          <span
            class="mr-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >Details</span
          >
          <div
            class="bg-white border-2 border-gray-100 text-black p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <IconsInfo />
          </div>
        </button>
      </div>
    </transition>

    <button
      @click="showFabMenu = !showFabMenu"
      class="bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-colors duration-300 outline-none flex items-center justify-center w-14 h-14 group"
    >
      <div
        class="relative w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-in-out"
        :class="showFabMenu ? 'rotate-135' : 'group-hover:scale-110'"
      >
        <span
          class="absolute block w-0.5 h-full bg-white rounded-full transition-colors"
        ></span>
        <span
          class="absolute block w-full h-0.5 bg-white rounded-full transition-colors"
        ></span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  disabled: { type: Boolean, default: false },
  showApproveReject: { type: Boolean, default: false },
});

const emit = defineEmits(["approve", "reject", "toggle-details"]);
const showFabMenu = ref(false);

const handleAction = (action) => {
  emit(action);
  showFabMenu.value = false;
};
</script>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
