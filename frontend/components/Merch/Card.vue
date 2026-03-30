<template>
  <div
    class="group flex flex-col h-full bg-theme-surface border border-theme-border rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
    @click="$emit('select')"
  >
    <div
      class="relative aspect-square bg-theme-base overflow-hidden border-b border-white/5 flex items-center justify-center touch-pan-y"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <img
        v-if="hasImages"
        :src="item.images[activeIndex]"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 select-none"
        draggable="false"
      />
      <Icon
        v-else
        name="heroicons:photo"
        class="w-20 h-20 text-gray-800 transition-transform duration-700 group-hover:scale-105"
      />

      <div
        class="absolute inset-0 bg-linear-to-t from-theme-surface/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      ></div>

      <div
        v-if="isSlidable"
        class="absolute inset-0 flex items-center justify-between px-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <button
          @click.stop="prevImage"
          class="p-1.5 rounded-full bg-black/50 text-white hover:bg-theme-primary transition-colors backdrop-blur-sm"
        >
          <Icon name="heroicons:chevron-left" class="w-5 h-5" />
        </button>
        <button
          @click.stop="nextImage"
          class="p-1.5 rounded-full bg-black/50 text-white hover:bg-theme-primary transition-colors backdrop-blur-sm"
        >
          <Icon name="heroicons:chevron-right" class="w-5 h-5" />
        </button>
      </div>

      <div
        v-if="isSlidable"
        class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10"
      >
        <div
          v-for="(_, idx) in item.images"
          :key="idx"
          class="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          :class="activeIndex === idx ? 'bg-theme-primary w-3' : 'bg-white/40'"
        ></div>
      </div>
    </div>

    <div class="p-5 flex flex-col grow">
      <div class="mb-3">
        <h3
          class="font-display text-lg font-bold tracking-tight text-white mb-1.5 group-hover:text-theme-primary transition-colors uppercase line-clamp-1"
        >
          {{ item.name }}
        </h3>
        <p
          v-if="item.description"
          class="text-md text-gray-400 leading-relaxed line-clamp-2"
        >
          {{ item.description }}
        </p>
      </div>

      <div
        class="mt-auto pt-4 flex flex-col gap-4 border-t border-theme-border group-hover:border-theme-primary/20 transition-colors"
      >
        <span class="font-sans font-bold text-xl text-theme-primary">
          {{ item.price }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

defineEmits(["select"]);

// --- Internal Slider State ---
const activeIndex = ref(0);

// --- Computed Helpers ---
const hasImages = computed(
  () => props.item.images && props.item.images.length > 0,
);
const isSlidable = computed(
  () => props.item.images && props.item.images.length > 1,
);

// --- Navigation Functions ---
const nextImage = () => {
  if (isSlidable.value) {
    activeIndex.value = (activeIndex.value + 1) % props.item.images.length;
  }
};

const prevImage = () => {
  if (isSlidable.value) {
    activeIndex.value =
      (activeIndex.value - 1 + props.item.images.length) %
      props.item.images.length;
  }
};

// --- Swipe Logic for Mobile ---
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  // Record the initial X position of the user's finger
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  // Record the final X position when they lift their finger
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  if (!isSlidable.value) return;

  const swipeThreshold = 40; // Minimum pixel distance to be considered a swipe
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (swipeDistance < -swipeThreshold) {
    // Swiped left -> Go to next image
    nextImage();
  } else if (swipeDistance > swipeThreshold) {
    // Swiped right -> Go to previous image
    prevImage();
  }
};
</script>
