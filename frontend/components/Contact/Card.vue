<template>
  <div
    class="bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-2xl hover:border-orange-500/30 transition-all duration-500 shadow-xl group flex flex-col h-full relative overflow-hidden"
  >
    <div
      class="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500"
    ></div>

    <div
      class="w-16 h-16 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-orange-500 group-hover:-translate-y-1 transition-transform duration-500 mb-8 relative z-10 shrink-0"
    >
      <Icon :name="titleIcon" class="w-8 h-8" />
    </div>

    <div class="grow flex flex-col relative z-10">
      <h3
        class="text-white font-display font-bold text-xl md:text-2xl mb-3 uppercase tracking-wide"
      >
        {{ title }}
      </h3>
      <p class="text-gray-500 mb-8 text-sm font-light leading-relaxed">
        {{ subtitle }}
      </p>

      <div class="mt-auto pt-6 border-t border-gray-800/50">
        <button
          @click="emits('action')"
          class="inline-flex items-center gap-2 text-orange-500 font-semibold text-xs tracking-widest uppercase hover:text-yellow-400 transition-colors group-hover:translate-x-1 duration-300"
        >
          {{ action }}
          <Icon :name="actionIcon" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  titleIcon: {
    type: String,
    default: "heroicons:envelope",
  },
  action: {
    type: String,
    default: "Send Message",
  },
  actionIcon: {
    type: String,
    default: "heroicons:arrow-right",
  },
});

const emits = defineEmits(["action"]);
</script>
