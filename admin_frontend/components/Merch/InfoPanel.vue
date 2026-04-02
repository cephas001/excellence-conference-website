<template>
  <div
    ref="panelRef"
    class="fixed bottom-26 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up"
  >
    <div class="bg-black text-white p-4">
      <h3 class="text-center text-sm">Merch Reference Info</h3>
    </div>

    <div class="p-5 overflow-y-auto max-h-[60vh]">
      <h4 class="text-xs font-bold text-black uppercase mb-4 pl-1">
        Packages & Pricing
      </h4>
      <ul class="space-y-3 mb-6 text-sm">
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black"
            >Premium
            <span class="block text-xs text-gray-600 font-normal"
              >All Items</span
            ></span
          >
          <span class="font-bold text-black tracking-wide">₦10,000</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black"
            >Deluxe
            <span class="block text-xs text-gray-600 font-normal"
              >T-shirt, Jotter, Wristband</span
            ></span
          >
          <span class="font-bold text-black tracking-wide">₦8,000</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black"
            >Standard
            <span class="block text-xs text-gray-600 font-normal"
              >T-shirt, Jotter</span
            ></span
          >
          <span class="font-bold text-black tracking-wide">₦7,000</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black"
            >Minimum
            <span class="block text-xs text-gray-600 font-normal"
              >Jotter, Water Bottle</span
            ></span
          >
          <span class="font-bold text-black tracking-wide">₦3,500</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">T-Shirt only</span>
          <span class="font-bold text-black tracking-wide">₦5,000</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Wristband only</span>
          <span class="font-bold text-black tracking-wide">₦1,000</span>
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
          <span class="font-bold text-black">MONIEPOINT</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Number:</span>
          <span class="font-bold text-black tracking-wide">9160822562</span>
        </li>
        <li
          class="flex justify-between items-center border border-gray-100 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-black">Name:</span>
          <span class="font-bold text-black">KADIRI IYINOLUWA ESTHER</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["close"]);

// 1. Grab the panel element from the template
const panelRef = ref(null);

// 2. Tell VueUse to fire the 'close' event if a click happens outside the panel
onClickOutside(panelRef, () => {
  emit("close");
});
</script>
