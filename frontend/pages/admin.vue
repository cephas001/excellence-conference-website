<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30 pt-20"
  >
    <AdminLogin
      v-if="!isAuthenticated"
      @login="handleLogin"
      :is-loading="isLoading"
      :error="loginError"
    />

    <div v-else class="flex h-screen overflow-hidden bg-gray-950">
      <AdminSidebar
        :active-panel="activePanel"
        @navigate="activePanel = $event"
        @logout="handleLogout"
      />

      <main class="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <header
          class="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-gray-800"
        >
          <h1 class="text-xl font-display font-bold text-orange-500 uppercase">
            Majestic Admin
          </h1>
          <button @click="handleLogout" class="text-red-400">
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-6 h-6" />
          </button>
        </header>

        <AdminPanelSpeakers
          v-if="activePanel === 'speakers'"
          class="animate-fade-in"
        />
        <AdminPanelTestimonies
          v-if="activePanel === 'testimonies'"
          class="animate-fade-in"
        />
        <AdminPanelMerch
          v-if="activePanel === 'merch'"
          class="animate-fade-in"
        />
        <AdminPanelSettings
          v-if="activePanel === 'settings'"
          class="animate-fade-in"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Note: Nuxt auto-imports AdminLogin, AdminSidebar, and your Panel components

const isAuthenticated = ref(false);
const isLoading = ref(false);
const loginError = ref("");
const activePanel = ref("speakers");

const handleLogin = (credentials) => {
  isLoading.value = true;
  loginError.value = "";

  if (!credentials.email || !credentials.password) {
    loginError.value = "Email and password are required.";
    isLoading.value = false;
    return;
  }

  // Mock Auth - Replace with Firebase Auth later
  setTimeout(() => {
    isAuthenticated.value = true;
    isLoading.value = false;
  }, 400);
};

const handleLogout = () => {
  isAuthenticated.value = false;
  loginError.value = "";
  activePanel.value = "speakers"; // Reset to default panel
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
