<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-orange-500 selection:text-black pt-30 pb-20"
  >
    <main class="px-6 md:px-8 max-w-3xl mx-auto">
      <header class="mb-14 relative">
        <div
          class="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none"
        ></div>
        <h1
          class="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white leading-none mb-4 uppercase"
        >
          Conference
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-400"
            >Schedule</span
          >
        </h1>
        <p
          class="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-poppins"
        >
          Shining the Light on the future of leadership, and spirituality. Join
          us for 6 days of intensive growth and high-impact sessions.
        </p>
      </header>

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

      <section class="relative min-h-[300px] mt-6">
        <div
          class="absolute left-[85px] md:left-[104px] top-2 bottom-0 w-px bg-gray-800"
          v-if="activeDocument && activeDocument.items.length > 0"
        ></div>

        <div
          v-if="!activeDocument || activeDocument.items.length === 0"
          class="text-center py-20 text-gray-500 font-light border border-dashed border-gray-800 rounded-2xl bg-gray-900/30"
        >
          No programs scheduled for this specific session yet.
        </div>

        <TransitionGroup name="list" tag="div" class="flex flex-col">
          <div
            v-for="(item, index) in roadmapItems"
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
                class="mt-4 w-full sm:max-w-sm flex items-center justify-between bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 p-2 pr-4 rounded-[1rem] cursor-pointer transition-all duration-300 group/card shadow-sm"
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
    </main>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-gray-900 border border-gray-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative"
        >
          <div
            class="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
          ></div>

          <div class="p-6 md:p-8 relative z-10">
            <button
              @click="closeModal"
              class="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>

            <div class="text-center pt-4">
              <div
                class="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden bg-gray-950 border-2 border-orange-500 p-1 shrink-0"
              >
                <img
                  v-if="activeSession?.speaker.image"
                  :src="activeSession?.speaker.image"
                  class="w-full h-full object-cover rounded-full bg-gray-800"
                />
                <Icon
                  v-else
                  name="heroicons:user"
                  class="w-full h-full p-6 text-gray-600 rounded-full bg-gray-800"
                />
              </div>
              <h3
                class="font-display font-bold text-2xl text-white mb-1 uppercase"
              >
                {{ activeSession?.speaker.name }}
              </h3>
              <p
                class="text-orange-500 text-xs font-bold tracking-widest uppercase mb-6"
              >
                {{ activeSession?.speaker.role }}
              </p>

              <div
                class="text-left bg-gray-950 p-4 rounded-xl border border-gray-800 mb-6"
              >
                <p
                  class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  Speaking On
                </p>
                <p class="text-gray-200 font-semibold text-sm">
                  {{ activeSession?.title }}
                </p>
              </div>

              <div
                class="text-left max-h-48 overflow-y-auto pr-2 custom-scrollbar"
              >
                <p
                  class="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {{
                    activeSession?.speaker.bio ||
                    "Detailed biography coming soon."
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const api = useConferenceData();

// Modal States
const isModalOpen = ref(false);
const activeSession = ref(null);

const openModal = (session) => {
  if (session.type === "break" || !session.speaker) return;
  activeSession.value = session;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    activeSession.value = null;
    document.body.style.overflow = "";
  }, 300);
};

// Time Logic Constants
const SESSION_LENGTH_MINUTES = 60;
const WAT_OFFSET = "+01:00";
const currentTime = ref(new Date());
let timeInterval;

// Data
const {
  data: agenda,
  pending: agendaLoading,
  error: agendaError,
} = await api.getAgenda();

// --- Data Restructuring Logic ---
const groupedAgenda = computed(() => {
  const map = new Map();
  agenda.value.forEach((doc) => {
    if (!map.has(doc.date)) {
      map.set(doc.date, { date: doc.date, docs: [] });
    }
    map.get(doc.date).docs.push(doc);
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
});

const selectedDate = ref("2026-05-21");
const selectedSessionId = ref("dQ25TaGXHFPPLymYGhMG");

const selectDate = (date) => {
  selectedDate.value = date;
  const group = groupedAgenda.value.find((g) => g.date === date);
  if (group && group.docs.length > 0) {
    selectedSessionId.value = group.docs[0].id;
  }
};

const availableSessions = computed(() => {
  const group = groupedAgenda.value.find((g) => g.date === selectedDate.value);
  return group ? group.docs : [];
});

const activeDocument = computed(() => {
  return agenda.value.find((d) => d.id === selectedSessionId.value);
});

const roadmapItems = computed(() => {
  if (!activeDocument.value || !activeDocument.value.items) return [];

  return activeDocument.value.items.map((item) => {
    const start = parseDateTime(activeDocument.value.date, item.time);
    const end = new Date(start.getTime() + SESSION_LENGTH_MINUTES * 60 * 1000);
    const now = currentTime.value;

    let status = "Upcoming";
    if (now >= start && now <= end) status = "Live";
    else if (now > end) status = "Completed";

    return { ...item, status };
  });
});

// --- Formatting Helpers ---
const getMonthString = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short" });
};

const getDayString = (dateStr) => {
  const d = new Date(dateStr);
  return d.getDate().toString().padStart(2, "0");
};

const formatSublabel = (sublabel) => {
  if (!sublabel) return "Main Session";
  return sublabel.split(",")[0].trim();
};

const getStatusColor = (status) => {
  switch (status) {
    case "Live":
      return "bg-red-900/20 text-red-500 border-red-900/50";
    case "Completed":
      return "bg-gray-900/50 text-gray-600 border-gray-800";
    default:
      return "bg-[#111827] text-gray-400 border-gray-700";
  }
};

const parseDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch)
    return new Date(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00${WAT_OFFSET}`,
    );

  let [, h, m, ampm] = timeMatch;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
  if (ampm.toUpperCase() === "AM" && h === 12) h = 0;

  return new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00${WAT_OFFSET}`,
  );
};

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
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
