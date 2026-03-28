<template>
  <div class="animate-fade-in max-w-4xl">
    <header class="mb-10">
      <h2
        class="font-display text-4xl font-bold text-white tracking-tight mb-2 uppercase"
      >
        Event Settings
      </h2>
      <p class="text-gray-400">
        Configure global conference details, locations, and announcements.
      </p>
    </header>

    <div class="space-y-8">
      <section
        class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8"
      >
        <h3
          class="font-display text-xl font-bold text-white mb-4 uppercase flex items-center gap-2"
        >
          <Icon name="heroicons:map-pin" class="w-6 h-6 text-orange-500" /> Main
          Venue
        </h3>
        <form @submit.prevent="submitVenue" class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Venue Name</label
            >
            <input
              v-model="venue.name"
              type="text"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Google Maps Link</label
            >
            <input
              v-model="venue.mapLink"
              type="url"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Full Address</label
            >
            <input
              v-model="venue.address"
              type="text"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
            />
          </div>
          <div class="sm:col-span-2 pt-2">
            <button
              type="submit"
              class="bg-gray-800 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-700"
            >
              Save Venue
            </button>
          </div>
        </form>
      </section>

      <section
        class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8"
      >
        <h3
          class="font-display text-xl font-bold text-white mb-4 uppercase flex items-center gap-2"
        >
          <Icon name="heroicons:sparkles" class="w-6 h-6 text-orange-500" />
          Workers Dinner
        </h3>
        <form @submit.prevent="submitDinner" class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Location / Room</label
            >
            <input
              v-model="dinner.venueName"
              type="text"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Date & Time</label
            >
            <input
              v-model="dinner.dateTime"
              type="text"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
            />
          </div>
          <div class="sm:col-span-2 pt-2">
            <button
              type="submit"
              class="bg-gray-800 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-700"
            >
              Save Dinner Details
            </button>
          </div>
        </form>
      </section>

      <section
        class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8"
      >
        <h3
          class="font-display text-xl font-bold text-white mb-4 uppercase flex items-center gap-2"
        >
          <Icon name="heroicons:megaphone" class="w-6 h-6 text-orange-500" />
          Global Announcement Banner
        </h3>
        <form @submit.prevent="submitAnnouncement" class="space-y-4">
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500"
              >Banner Text (Leave blank to hide)</label
            >
            <input
              v-model="announcement"
              type="text"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
              placeholder="e.g. Registration closes tomorrow!"
            />
          </div>
          <div class="pt-2">
            <button
              type="submit"
              class="bg-orange-500 text-black px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest"
            >
              Update Banner
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { getEventSettings } = useConferenceData();
const {
  updateVenueSettings,
  updateDinnerSettings,
  updateAnnouncementSettings,
} = useAdminMutations();

const venue = ref({ name: "", address: "", mapLink: "" });
const dinner = ref({ venueName: "", dateTime: "" });
const announcement = ref("");

const rawSettings = ref({});

const loadData = async () => {
  try {
    const { data } = await getEventSettings();
    if (!data.value) return;

    rawSettings.value = data.value;

    venue.value = {
      name: data.value.venue?.venueName || "",
      address: data.value.venue?.address || "",
      mapLink: data.value.venue?.mapLink || "",
    };

    const dDate = data.value.dinner?.date || "";
    const dTime = data.value.dinner?.time || "";
    dinner.value = {
      venueName: data.value.dinner?.venueName || "",
      dateTime: [dDate, dTime].filter(Boolean).join(" "),
    };

    announcement.value = data.value.current?.message || "";
  } catch (error) {
    console.error("Failed to load event settings", error);
  }
};

const submitVenue = async () => {
  try {
    await updateVenueSettings({
      venueName: venue.value.name.trim() || null,
      address: venue.value.address.trim() || null,
      mapLink: venue.value.mapLink.trim() || null,
    });
    alert("Venue saved.");
  } catch (error) {
    alert("Failed to save venue.");
  }
};

const submitDinner = async () => {
  try {
    const current = rawSettings.value.dinner || {};
    await updateDinnerSettings({
      venueName: dinner.value.venueName.trim() || null,
      venueAddress: current.venueAddress || null,
      date: dinner.value.dateTime.trim() || null,
      time: current.time || null,
      description: current.description || null,
      mapLink: current.mapLink || null,
    });
    alert("Dinner details saved.");
  } catch (error) {
    alert("Failed to save dinner details.");
  }
};

const submitAnnouncement = async () => {
  try {
    const current = rawSettings.value.current || {};
    await updateAnnouncementSettings({
      message: announcement.value.trim() || null,
      endTime: current.endTime || null,
    });
    alert("Announcement saved.");
  } catch (error) {
    alert("Failed to save announcement.");
  }
};

onMounted(() => loadData());
</script>
