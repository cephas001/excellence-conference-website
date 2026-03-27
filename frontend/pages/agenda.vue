<template>
  <div id="app" class="max-w-md mx-auto min-h-screen relative bg-gray-900">
    <!-- Agenda by day (accordion) -->
    <main class="px-6 py-4">
      <div id="agenda-list" class="space-y-2">
        <!-- Day dropdowns and timelines injected here -->
      </div>
    </main>

    <!-- Speaker detail modal -->
    <div
      id="speaker-modal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div
        class="bg-gray-800 border border-gray-700 rounded-2xl max-w-sm w-full max-h-[85vh] overflow-hidden shadow-xl"
      >
        <div class="p-5">
          <div class="flex justify-end mb-2">
            <button
              type="button"
              id="speaker-modal-close"
              class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <IconsClose class="text-2xl" />
            </button>
          </div>
          <div id="speaker-modal-content" class="text-center">
            <!-- Filled by JS -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
