<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-orange-500 selection:text-black pt-30 pb-20"
  >
    <main class="px-6 md:px-8 max-w-3xl mx-auto">
      <AppPageHeader
        plainText="Conference"
        styledText="Schedule"
        description=" Shining the Light on the future of leadership, and spirituality. Join
          us for 6 days of intensive growth and high-impact sessions."
      />

      <div v-if="agendaLoading" class="flex justify-center items-center py-20">
        <Icon
          name="heroicons:arrow-path"
          class="w-10 h-10 text-orange-500 animate-spin"
        />
      </div>

      <div
        v-else-if="agendaError"
        class="text-center py-20 bg-gray-900 border border-red-900/50 rounded-xl"
      >
        <Icon
          name="heroicons:exclamation-triangle"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <p class="text-gray-400 mb-4">Unable to load the schedule.</p>
        <button
          @click="refreshAgenda"
          class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <div v-else>
        <div
          class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div class="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="group in groupedAgenda"
              :key="group.date"
              @click="selectDate(group.date)"
              class="px-6 py-3 font-display text-xl tracking-tight flex flex-col items-start min-w-25 transition-all duration-300 rounded-sm"
              :class="
                selectedDate === group.date
                  ? 'bg-linear-to-br from-orange-500 to-yellow-500 text-black shadow-lg shadow-orange-500/20'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
              "
            >
              <span
                class="text-xs font-sans font-bold opacity-80 mb-1 uppercase"
                >{{ getMonthString(group.date) }}</span
              >
              <span class="font-bold tracking-wide">{{
                getDayString(group.date)
              }}</span>
            </button>
          </div>
        </div>

        <div class="mb-14" v-if="availableSessions.length > 0">
          <h3
            class="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] mb-3 ml-1"
          >
            Filter by session
          </h3>
          <div
            class="flex border border-gray-800 rounded-md font-poppins p-1 bg-gray-950/50"
          >
            <button
              v-for="session in availableSessions"
              :key="session.id"
              @click="selectedSessionId = session.id"
              class="flex-1 py-3 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-sm transition-colors truncate"
              :class="
                selectedSessionId === session.id
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
              "
            >
              {{ formatSublabel(session.sublabel) }}
            </button>
          </div>
        </div>

        <section class="relative min-h-75 mt-6">
          <div
            class="absolute left-21.25 md:left-26 top-2 bottom-0 w-px bg-gray-800"
            v-if="activeDocument && activeDocument.items.length > 0"
          ></div>

          <div
            v-if="!activeDocument || activeDocument.items.length === 0"
            class="text-center py-20 text-gray-500 font-light border border-dashed border-gray-800 rounded-2xl bg-gray-900/30 px-4"
          >
            No programs scheduled for this specific session yet.
          </div>

          <TransitionGroup name="list" tag="div" class="flex flex-col">
            <div
              v-for="item in roadmapItems"
              :key="item.time + item.title"
              class="relative flex flex-row items-start group pb-14 last:pb-2"
            >
              <div
                class="w-22.25 md:w-26 pr-4 shrink-0 flex justify-end relative z-10"
              >
                <div
                  class="bg-[#111827] border border-gray-700/50 text-gray-200 text-[10px] md:text-xs font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg whitespace-nowrap"
                >
                  {{ item.time }}
                </div>
              </div>

              <div class="flex-1 pl-5 md:pl-8 -mt-1">
                <div class="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border"
                    :class="getStatusColor(item.status)"
                  >
                    {{ item.status }}
                  </span>
                  <span
                    v-if="item.tag"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border bg-gray-800 border-gray-700 text-gray-300"
                  >
                    {{ item.tag }}
                  </span>
                </div>

                <h3
                  class="text-lg md:text-2xl font-display font-bold text-white mb-1.5 leading-tight"
                >
                  {{ item.title }}
                </h3>
                <p
                  v-if="item.description"
                  class="text-xs md:text-sm text-gray-400 leading-relaxed"
                >
                  {{ item.description }}
                </p>

                <div
                  v-if="item.type === 'detailed' && item.speaker"
                  @click="openModal(item)"
                  class="mt-4 w-full sm:max-w-sm flex items-center justify-between bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 p-2 pr-4 rounded-2xl cursor-pointer transition-all duration-300 group/card shadow-sm"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-950 shrink-0 border border-gray-700/50 flex items-center justify-center"
                    >
                      <img
                        v-if="item.speaker.image"
                        :src="item.speaker.image"
                        :alt="item.speaker.name"
                        class="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all"
                      />
                      <Icon
                        v-else
                        name="heroicons:user"
                        class="p-2.5 text-gray-600"
                      />
                    </div>
                    <div class="min-w-0 pr-2">
                      <h4
                        class="text-white font-bold text-xs md:text-sm truncate"
                      >
                        {{ item.speaker.name }}
                      </h4>
                      <p class="text-gray-400 text-[10px] md:text-xs truncate">
                        {{ item.speaker.role }}
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="heroicons:chevron-right"
                    class="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover/card:text-orange-500 shrink-0 transition-colors"
                  />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </section>
      </div>
    </main>

    <SpeakerModal
      :is-open="isModalOpen"
      :speaker="formattedModalSpeaker"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// Auto-imported: useConferenceData, useAgendaManager, SpeakerModal

const api = useConferenceData();

// --- Data Fetching ---
const {
  data: agenda,
  pending: agendaLoading,
  error: agendaError,
  refresh: refreshAgenda,
} = await api.getAgenda();

// --- Connect Composable Logic ---
// We pass the reactive agenda data to our new composable
const {
  groupedAgenda,
  selectedDate,
  selectedSessionId,
  selectDate,
  availableSessions,
  activeDocument,
  roadmapItems,
  getMonthString,
  getDayString,
  formatSublabel,
  getStatusColor,
} = useAgendaManager(agenda);

// --- Modal States ---
const isModalOpen = ref(false);
const activeSession = ref(null);

const openModal = (session) => {
  if (session.type === "break" || !session.speaker) return;
  activeSession.value = session;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    activeSession.value = null;
  }, 300);
};

// Map the session data to match what <SpeakerModal /> expects (combining speaker + topic)
const formattedModalSpeaker = computed(() => {
  if (!activeSession.value || !activeSession.value.speaker) return null;
  return {
    ...activeSession.value.speaker,
    topic: activeSession.value.title, // Inject the agenda title as the topic
  };
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
