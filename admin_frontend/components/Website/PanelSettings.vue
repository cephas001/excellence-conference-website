<template>
  <div class="animate-fade-in max-w-4xl">
    <header class="mb-10">
      <h2
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Event Settings
      </h2>
      <p class="text-sm text-gray-500 font-medium">
        Configure global conference details, locations, and announcements.
      </p>
    </header>

    <div class="space-y-8">
      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
      >
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"
        >
          <Icon name="heroicons:map-pin" class="w-5 h-5 text-gray-400" /> Main
          Venue
        </h3>
        <form @submit.prevent="submitVenue" class="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Venue Name</label
            >
            <input
              v-model="venue.name"
              type="text"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div>
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Google Maps Link</label
            >
            <input
              v-model="venue.mapLink"
              type="url"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div class="sm:col-span-2">
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Full Address</label
            >
            <input
              v-model="venue.address"
              type="text"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div class="sm:col-span-2 pt-4">
            <button
              type="submit"
              class="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors"
            >
              Save Venue
            </button>
          </div>
        </form>
      </section>

      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
      >
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"
        >
          <Icon name="heroicons:sparkles" class="w-5 h-5 text-gray-400" />
          Workers Dinner
        </h3>
        <form @submit.prevent="submitDinner" class="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Location / Room</label
            >
            <input
              v-model="dinner.venueName"
              type="text"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div>
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Date & Time</label
            >
            <input
              v-model="dinner.dateTime"
              type="text"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div class="sm:col-span-2 pt-4">
            <button
              type="submit"
              class="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors"
            >
              Save Dinner Details
            </button>
          </div>
        </form>
      </section>

      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
      >
        <h3
          class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2"
        >
          <Icon name="heroicons:megaphone" class="w-5 h-5 text-gray-400" />
          Global Announcement Banner
        </h3>
        <form @submit.prevent="submitAnnouncement" class="space-y-4">
          <div>
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >Banner Text (Leave blank to hide)</label
            >
            <input
              v-model="announcement"
              type="text"
              placeholder="e.g. Registration closes tomorrow!"
              class="w-full text-sm border border-gray-300 focus:border-black rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div class="pt-4">
            <button
              type="submit"
              class="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors"
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
import { useAlertModal } from "~/composables/useAlertModal";

const { getEventSettings } = useConferenceData();
const {
  updateVenueSettings,
  updateDinnerSettings,
  updateAnnouncementSettings,
} = useAdminMutations();

const { showAlert } = useAlertModal();

const venue = ref({ name: "", address: "", mapLink: "" });
const dinner = ref({ venueName: "", dateTime: "" });
const announcement = ref("");

const rawSettings = ref({});

const loadData = async () => {
  try {
    const response = await getEventSettings();
    // Use response.data if your backend wraps the payload, otherwise use response directly
    const data = response.data || response;

    if (!data) return;

    rawSettings.value = data;

    venue.value = {
      name: data.venue?.venueName || "",
      address: data.venue?.address || "",
      mapLink: data.venue?.mapLink || "",
    };

    const dDate = data.dinner?.date || "";
    const dTime = data.dinner?.time || "";
    dinner.value = {
      venueName: data.dinner?.venueName || "",
      dateTime: [dDate, dTime].filter(Boolean).join(" "),
    };

    announcement.value = data.current?.message || "";
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert("Failed to load event settings.", "error");
  }
};

const submitVenue = async () => {
  try {
    await updateVenueSettings({
      venueName: venue.value.name.trim() || null,
      address: venue.value.address.trim() || null,
      mapLink: venue.value.mapLink.trim() || null,
    });
    showAlert("Venue details saved successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save venue.", "error");
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
    showAlert("Dinner details saved successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to save dinner details.", "error");
  }
};

const submitAnnouncement = async () => {
  try {
    const current = rawSettings.value.current || {};
    await updateAnnouncementSettings({
      message: announcement.value.trim() || null,
      endTime: current.endTime || null,
    });
    showAlert("Announcement banner updated successfully.", "success");
  } catch (error) {
    if (error.response?._handledGlobally) return;
    showAlert(error.data?.error || "Failed to update announcement.", "error");
  }
};

onMounted(() => loadData());
</script>
