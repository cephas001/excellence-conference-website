<template>
  <div class="flex h-screen bg-gray-50 text-gray-900">
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-900/50 transition-opacity md:hidden"
    ></div>

    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
      ]"
    >
      <div
        class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0"
      >
        <h1 class="text-lg font-bold tracking-tight">EC Admin</h1>
        <button
          @click="isSidebarOpen = false"
          class="ml-auto md:hidden text-black hover:text-gray-600"
        >
          <Icon name="heroicons:x-mark" class="h-6 w-6" />
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NuxtLink
          to="/"
          @click="isSidebarOpen = false"
          :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50  ${checkActiveRoute('/') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
        >
          <Icon name="heroicons:home" class="mr-3 h-5 w-5 opacity-75" />
          Dashboard
        </NuxtLink>

        <p
          class="my-2 px-3 py-2.5 text-sm rounded-lg flex items-center justify-between text-black font-semibold cursor-pointer hover:bg-gray-50 transition-all duration-200 group selection:bg-transparent"
          @click="showDinnerReviewManagement = !showDinnerReviewManagement"
        >
          <span class="flex items-center"> Dinner Review </span>
          <IconsRightCaret
            :class="[
              'h-4 w-4 transition-transform duration-200 text-gray-400 group-hover:text-black',
              showDinnerReviewManagement ? 'rotate-90' : '',
            ]"
          />
        </p>

        <div v-show="showDinnerReviewManagement">
          <NuxtLink
            to="/dinner"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors  hover:bg-gray-50  hover:text-black ${checkActiveRoute('/dinner') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon name="heroicons:cake" class="mr-3 h-5 w-5 opacity-75" />
            Workers Dinner
          </NuxtLink>

          <NuxtLink
            to="/dinner/analytics"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/dinner/analytics') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon name="heroicons:chart-bar" class="mr-3 h-5 w-5 opacity-75" />
            Dinner Analytics
          </NuxtLink>
          <NuxtLink
            to="/dinner/manual-entry"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/dinner/manual-entry') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon
              name="heroicons:document-plus"
              class="mr-3 h-5 w-5 opacity-75"
            />
            Manual Entry
          </NuxtLink>
        </div>

        <p
          class="my-2 px-3 py-2.5 text-sm rounded-lg flex items-center justify-between text-black font-semibold cursor-pointer hover:bg-gray-50 transition-all duration-200 group selection:bg-transparent"
          @click="showMerchReviewManagement = !showMerchReviewManagement"
        >
          <span class="flex items-center"> Merch Review </span>
          <IconsRightCaret
            :class="[
              'h-4 w-4 transition-transform duration-200 text-gray-400 group-hover:text-black',
              showMerchReviewManagement ? 'rotate-90' : '',
            ]"
          />
        </p>

        <div v-show="showMerchReviewManagement">
          <NuxtLink
            to="/merch"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/merch') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon
              name="heroicons:shopping-bag"
              class="mr-3 h-5 w-5 opacity-75"
            />
            EC Merch
          </NuxtLink>

          <NuxtLink
            to="/merch/analytics"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/merch/analytics') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon name="heroicons:chart-bar" class="mr-3 h-5 w-5 opacity-75" />
            Merch Analytics
          </NuxtLink>

          <NuxtLink
            to="/merch/checkout"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/merch/checkout') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon
              name="heroicons:shopping-cart"
              class="mr-3 h-5 w-5 opacity-75"
            />
            Merch Checkout
          </NuxtLink>

          <NuxtLink
            to="/merch/manual-entry"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/merch/manual-entry') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon
              name="heroicons:document-plus"
              class="mr-3 h-5 w-5 opacity-75"
            />
            Manual Entry
          </NuxtLink>
        </div>

        <p
          class="my-2 px-3 py-2.5 text-sm rounded-lg flex items-center justify-between text-black font-semibold cursor-pointer hover:bg-gray-50 transition-all duration-200 group selection:bg-transparent"
          @click="showWebManagement = !showWebManagement"
        >
          <span class="flex items-center"> Website Management </span>
          <IconsRightCaret
            :class="[
              'h-4 w-4 transition-transform duration-200 text-gray-400 group-hover:text-black',
              showWebManagement ? 'rotate-90' : '',
            ]"
          />
        </p>

        <div v-show="showWebManagement">
          <NuxtLink
            to="/website"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors  hover:bg-gray-50  hover:text-black ${checkActiveRoute('/website') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon name="heroicons:server" class="mr-3 h-5 w-5 opacity-75" />
            Website Content
          </NuxtLink>

          <NuxtLink
            to="/website/analytics"
            @click="isSidebarOpen = false"
            :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-black hover:bg-gray-50 ${checkActiveRoute('/website/analytics') ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
          >
            <Icon name="heroicons:chart-bar" class="mr-3 h-5 w-5 opacity-75" />
            Website Analytics
          </NuxtLink>
        </div>
      </nav>

      <div
        class="p-4 border-t border-gray-100 shrink-0 flex flex-col items-center"
      >
        <div class="flex items-center pb-4 w-full">
          <div
            class="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold"
          >
            {{ userInitial }}
          </div>
          <div class="ml-3 truncate">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ auth.user?.email || "Administrator" }}
            </p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          {{ auth.user ? "Logout" : "Login" }}
        </button>

        <NuxtLink
          v-if="auth.user?.role === 'super_admin'"
          to="/auth/register"
          @click="isSidebarOpen = false"
          class="mt-3 text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer"
        >
          + Add new administrator
        </NuxtLink>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden w-full relative">
      <div
        class="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 h-16 shrink-0"
      >
        <div class="flex items-center">
          <button
            @click="isSidebarOpen = true"
            class="text-black hover:text-gray-900 rounded-md mr-3 cursor-pointer"
          >
            <Icon name="heroicons:bars-3" class="h-6 w-6" />
          </button>
          <h1 class="text-lg font-bold tracking-tight">EC Reviewer</h1>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </div>
    </main>

    <ForbiddenModal />
    <AlertModal />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#vue-router";

const auth = useAuthStore();
const route = useRoute();

const showDinnerReviewManagement = ref(false);
const showMerchReviewManagement = ref(false);
const showWebManagement = ref(false);

// Track if the mobile sidebar is open
const isSidebarOpen = ref(false);

const userInitial = computed(() => {
  if (auth.user?.email) {
    return auth.user.email.charAt(0).toUpperCase();
  }
  return "R";
});

const checkActiveRoute = (url) => {
  return route.path == url;
};

function handleLogout() {
  auth.logout();
}
</script>
