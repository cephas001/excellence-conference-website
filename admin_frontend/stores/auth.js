// stores/auth.js
import { defineStore } from "pinia";
import { useCookie, useNuxtApp } from "#app";
import { signOut } from "firebase/auth"; // ADD THIS

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useCookie("ec_user").value || null,
    token: useCookie("ec_token").value || null,
  }),

  actions: {
    setAuth(userData, token) {
      this.user = userData;
      this.token = token;

      // Firebase tokens expire in 1 hour, so we lower the maxAge
      const tokenCookie = useCookie("ec_token", { maxAge: 60 * 60 });
      const userCookie = useCookie("ec_user", { maxAge: 60 * 60 * 8 }); // User data can stay longer

      tokenCookie.value = token;
      userCookie.value = userData;
    },

    async logout() {
      // Make this async
      try {
        const { $auth } = useNuxtApp();
        if ($auth) await signOut($auth); // Log out of Firebase
      } catch (error) {
        console.error("Firebase logout error", error);
      }

      this.user = null;
      this.token = null;

      const tokenCookie = useCookie("ec_token");
      const userCookie = useCookie("ec_user");

      tokenCookie.value = null;
      userCookie.value = null;

      navigateTo("/login"); // Note: You had "/login" here, but your middleware checks "/auth/login". Ensure this matches!
    },
  },
});
