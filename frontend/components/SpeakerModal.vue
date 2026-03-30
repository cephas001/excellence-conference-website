<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-theme-surface border border-theme-border rounded-sm max-w-md w-full overflow-hidden shadow-2xl relative"
      >
        <div
          class="absolute -top-24 -right-24 w-48 h-48 bg-theme-primary/10 blur-3xl rounded-full pointer-events-none"
        ></div>

        <div class="p-6 md:p-8 relative z-10">
          <button
            @click="close"
            class="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-sm transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>

          <div class="text-center pt-4">
            <div
              class="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-theme-primary p-1 shrink-0"
            >
              <img
                v-if="speaker?.image"
                :src="speaker.image"
                :alt="speaker.name"
                class="w-full h-full object-cover rounded-full bg-gray-800"
              />
              <div
                v-else
                class="w-full h-full rounded-full bg-gray-800 flex items-center justify-center"
              >
                <Icon name="heroicons:user" class="w-10 h-10 text-gray-600" />
              </div>
            </div>

            <h3
              class="font-display font-bold text-3xl text-white mb-1 uppercase"
            >
              {{ speaker?.name }}
            </h3>
            <p
              class="text-theme-primary text-sm font-semibold tracking-wider uppercase mb-6"
            >
              {{ speaker?.role }}
            </p>

            <div
              v-if="speaker?.topic"
              class="text-left bg-theme-base p-4 rounded-sm border border-theme-border mb-6"
            >
              <p
                class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Speaking On
              </p>
              <p class="text-gray-200 font-semibold text-sm">
                {{ speaker.topic }}
              </p>
            </div>

            <div
              class="text-left border-t border-theme-border pt-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar"
            >
              <p
                class="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap"
              >
                {{ speaker?.bio || "Detailed biography coming soon." }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  speaker: { type: Object, default: null },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

// Handle body scroll locking internally within the component
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}
</style>
