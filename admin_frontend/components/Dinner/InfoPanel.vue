<template>
  <div
    ref="panelRef"
    class="fixed bottom-26 right-6 z-40 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up"
  >
    <div class="bg-black text-white p-4">
      <h3 class="text-center text-sm">Dinner Reference Info</h3>
    </div>

    <div class="p-5 overflow-y-auto max-h-[60vh]">
      <h4 class="text-xs font-bold text-black uppercase mb-4 pl-1">
        Ticket Pricing
      </h4>
      <ul class="space-y-3 mb-6 text-sm">
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Workers Dinner</span>
          <span class="font-bold text-black tracking-wide">₦5,000</span>
        </li>
      </ul>

      <h4 class="text-xs font-bold text-black uppercase mb-4 pl-1">
        Account Details
      </h4>
      <ul class="space-y-3 text-sm">
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Bank:</span>
          <span class="font-bold text-black">OPAY</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Number:</span>
          <span class="font-bold text-black tracking-wide">7037865052</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Name:</span>
          <span class="font-bold text-black">HELEN FOLARIN</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["close"]);

// Grab the panel element from the template
const panelRef = ref(null);

// Tell VueUse to fire the 'close' event if a click happens outside the panel
onClickOutside(panelRef, () => {
  emit("close");
});
</script>
