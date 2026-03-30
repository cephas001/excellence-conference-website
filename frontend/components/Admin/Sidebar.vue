<template>
  <aside
    class="hidden lg:flex flex-col w-72 border-r border-theme-border bg-theme-surface overflow-y-auto shadow-2xl z-20"
  >
    <div class="p-8 pb-6">
      <h1
        class="text-2xl font-display font-bold tracking-tighter text-theme-primary uppercase"
      >
        Majestic Admin
      </h1>
      <p
        class="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1 uppercase"
      >
        Conference Manager
      </p>
    </div>

    <nav class="flex flex-col gap-1 pr-4 flex-grow">
      <button
        v-for="nav in navigation"
        :key="nav.id"
        @click="$emit('navigate', nav.id)"
        class="flex items-center gap-3 px-6 py-3.5 transition-all duration-300 w-full text-left"
        :class="
          activePanel === nav.id
            ? 'text-theme-primary bg-theme-primary/10 rounded-r-full font-semibold border-l-4 border-theme-primary'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-r-full border-l-4 border-transparent'
        "
      >
        <Icon :name="nav.icon" class="w-5 h-5 shrink-0" />
        <span class="font-medium text-sm tracking-wide">{{ nav.label }}</span>
      </button>
    </nav>

    <div class="p-6 border-t border-theme-border mt-auto">
      <div
        class="flex items-center gap-3 mb-6 bg-theme-base p-3 rounded-xl border border-theme-border"
      >
        <div
          class="w-10 h-10 rounded-full bg-theme-primary/20 flex items-center justify-center text-theme-primary font-bold"
        >
          A
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-semibold text-white truncate">Admin User</p>
          <p class="text-xs text-gray-500">Conference Lead</p>
        </div>
      </div>
      <button
        @click="$emit('logout')"
        class="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
      >
        <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activePanel: { type: String, required: true },
});

defineEmits(["navigate", "logout"]);

const navigation = [
  { id: "speakers", label: "Speakers", icon: "heroicons:microphone" },
  {
    id: "testimonies",
    label: "Testimonies",
    icon: "heroicons:chat-bubble-left-right",
  },
  { id: "merch", label: "Merchandise", icon: "heroicons:shopping-bag" },
  { id: "settings", label: "Event Settings", icon: "heroicons:cog-8-tooth" },
];
</script>
