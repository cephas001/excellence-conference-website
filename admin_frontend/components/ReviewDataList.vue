<template>
  <div class="space-y-5 flex-1 overflow-y-auto mb-6 pr-2">
    <div
      v-for="header in headers"
      :key="header"
      class="border-b border-gray-50 pb-3 last:border-0"
    >
      <h4
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
      >
        {{ formatHeader ? formatHeader(header) : header }}
      </h4>

      <slot name="field" :header="header" :value="data[header]">
        <div
          v-if="
            header.toLowerCase().includes('phone') ||
            header.toLowerCase().includes('whatsapp')
          "
          class="flex items-center"
        >
          <p
            class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
          >
            {{ data[header] || "—" }}
          </p>
          <a
            v-if="data[header]"
            :href="getWhatsAppLink(data[header])"
            target="_blank"
            class="ml-2 text-green-500 hover:text-green-600 hover:scale-110 transition-transform bg-green-50 p-1.5 rounded-full"
            title="Chat on WhatsApp"
          >
            <IconsWhatsApp />
          </a>
        </div>

        <p
          v-else
          class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
        >
          {{ data[header] || "—" }}
        </p>
      </slot>
    </div>

    <slot name="footer"></slot>
  </div>
</template>

<script setup>
// Make sure getWhatsAppLink is imported!
import { useReviewUtils } from "~/composables/useReviewUtils";
const { formatHeader, getWhatsAppLink } = useReviewUtils();

defineProps({
  headers: { type: Array, required: true },
  data: { type: Object, required: true },
});
</script>
