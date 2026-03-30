<template>
  <div
    class="fixed inset-0 z-[100] bg-theme-base flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md p-px bg-linear-to-br from-theme-primary/30 to-transparent rounded-2xl"
    >
      <div
        class="bg-theme-surface rounded-[calc(1rem-1px)] p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <div
          class="absolute -top-24 -right-24 w-48 h-48 bg-theme-primary/10 rounded-full blur-3xl pointer-events-none"
        ></div>

        <div class="text-center mb-10 relative z-10">
          <div
            class="w-16 h-16 bg-theme-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Icon
              name="heroicons:shield-check-solid"
              class="text-theme-primary w-10 h-10"
            />
          </div>
          <h2
            class="font-display text-3xl font-extrabold text-white mb-2 uppercase tracking-wide"
          >
            Admin Access
          </h2>
          <p class="text-gray-400 text-sm">Excellence Conference Backend</p>
        </div>

        <form @submit.prevent="submitLogin" class="space-y-6 relative z-10">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1"
              >Email Address</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-theme-primary transition-all placeholder:text-gray-600"
              placeholder="admin@excellence.org"
            />
          </div>

          <div class="space-y-1.5">
            <label
              class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1"
              >Password</label
            >
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full bg-theme-base border border-theme-border rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-theme-primary transition-all placeholder:text-gray-600"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />
          </div>

          <p
            v-if="error"
            class="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-md border border-red-900/50"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-theme-primary hover:bg-orange-600 disabled:opacity-50 py-4 rounded-xl text-black font-bold text-base uppercase tracking-widest shadow-[0_15px_30px_rgba(249,115,22,0.2)] transition-all"
          >
            {{ isLoading ? "Authenticating..." : "Sign In" }}
          </button>

          <div class="text-center mt-6">
            <NuxtLink
              to="/"
              class="text-sm text-gray-500 hover:text-theme-primary transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4" /> Back to
              Website
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  isLoading: Boolean,
  error: String,
});

const emit = defineEmits(["login"]);
const form = ref({ email: "", password: "" });

const submitLogin = () => {
  emit("login", { ...form.value });
};
</script>
