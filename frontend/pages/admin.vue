<template>
  <div
    class="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 md:p-8 overflow-x-hidden"
  >
    <div id="login-view" class="max-w-sm w-full mx-auto mt-8 sm:mt-16 px-0">
      <div class="flex justify-start mb-4">
        <button
          type="button"
          id="back-to-home-btn"
          class="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
        >
          <span aria-hidden="true">←</span> Home
        </button>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h1 class="text-xl font-bold text-white mb-1">Admin sign in</h1>
        <p class="text-gray-400 text-sm mb-6">
          Sign in to manage speakers and testimonies.
        </p>
        <form id="login-form" class="space-y-4">
          <div>
            <label
              for="admin-email"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Email</label
            >
            <input
              type="email"
              id="admin-email"
              required
              autocomplete="email"
              class="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
          </div>
          <div>
            <label
              for="admin-password"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Password</label
            >
            <input
              type="password"
              id="admin-password"
              required
              autocomplete="current-password"
              class="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
          </div>
          <p id="login-error" class="text-red-400 text-sm hidden"></p>
          <button
            type="submit"
            id="login-btn"
            class="w-full py-2.5 rounded-lg bg-accent-orange hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>

    <div
      id="admin-view"
      class="hidden min-h-screen bg-gray-900 overflow-x-hidden"
    >
      <!-- Backdrop when sidebar is open (mobile only) -->
      <div
        id="admin-sidebar-backdrop"
        class="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 opacity-0 pointer-events-none lg:pointer-events-none lg:opacity-0 lg:invisible"
        aria-hidden="true"
      ></div>

      <!-- Left sidebar: slide-out drawer on mobile, static on lg+ -->
      <aside
        id="admin-sidebar"
        class="fixed top-0 left-0 z-40 w-64 max-w-[85vw] lg:w-56 h-screen flex-shrink-0 bg-gray-800/95 border-r border-gray-700 flex flex-col -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:left-auto"
      >
        <div
          class="p-3 sm:p-4 border-b border-gray-700 flex items-center justify-between lg:block"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg bg-accent-orange/20 flex items-center justify-center text-accent-orange font-bold text-sm"
            >
              EC
            </div>
            <span class="text-white font-bold">Admin</span>
          </div>
          <button
            type="button"
            id="admin-sidebar-close"
            class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 lg:hidden"
            aria-label="Close menu"
          >
            <IconsClose class="w-5 h-5" />
          </button>
        </div>
        <div class="p-3 border-t border-gray-700 space-y-1">
          <button
            type="button"
            id="sign-out-btn"
            class="w-full px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium transition-colors text-left"
          >
            Sign out
          </button>
          <NuxtLink
            to="/"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm transition-colors"
          >
            <span aria-hidden="true">←</span> Home
          </NuxtLink>
        </div>
      </aside>

      <main
        class="flex-1 overflow-auto p-4 sm:p-6 md:p-8 max-w-4xl w-full min-w-0"
      >
        <!-- Panel: Speakers -->
        <div id="panel-speakers" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Speakers</h1>
            <p class="text-gray-400 text-sm mb-4">
              Manage speakers displayed on the home page.
            </p>
            <div id="speakers-list" class="mb-6 space-y-2"></div>
            <button
              type="button"
              id="add-speaker-btn"
              class="mb-4 px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
            >
              Add speaker
            </button>
            <form
              id="speaker-form"
              class="hidden mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 space-y-3"
            >
              <input type="hidden" id="speaker-id" value="" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="speaker-name"
                    required
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Role (optional)</label
                  >
                  <input
                    type="text"
                    id="speaker-role"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Bio (optional)</label
                >
                <textarea
                  id="speaker-bio"
                  rows="2"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Topic (optional)</label
                  >
                  <input
                    type="text"
                    id="speaker-topic"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Image URL (optional)</label
                  >
                  <input
                    type="text"
                    id="speaker-image"
                    placeholder="/img/speaker1.jpg"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  id="speaker-form-cancel"
                  class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>

        <!-- Panel: Testimonies -->
        <div id="panel-testimonies" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Testimonies</h1>
            <p class="text-gray-400 text-sm mb-4">
              Manage testimonies on the home page.
            </p>
            <div id="testimonies-list" class="mb-6 space-y-2"></div>
            <button
              type="button"
              id="add-testimony-btn"
              class="mb-4 px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
            >
              Add testimony
            </button>
            <form
              id="testimony-form"
              class="hidden mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 space-y-3"
            >
              <input type="hidden" id="testimony-id" value="" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="testimony-name"
                    required
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Location (optional)</label
                  >
                  <input
                    type="text"
                    id="testimony-location"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Testimony</label
                >
                <textarea
                  id="testimony-text"
                  rows="3"
                  required
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  id="testimony-form-cancel"
                  class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>

        <!-- Panel: Agenda -->
        <div id="panel-agenda" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Agenda</h1>
            <p class="text-gray-400 text-sm mb-4">
              Manage conference days and session items. Add a day, then expand
              it to add sessions.
            </p>
            <div id="agenda-days-list" class="mb-6 space-y-3"></div>
            <button
              type="button"
              id="add-agenda-day-btn"
              class="mb-4 px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
            >
              Add day
            </button>

            <form
              id="agenda-day-form"
              class="hidden mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 space-y-3"
            >
              <input type="hidden" id="agenda-day-id" value="" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Day name / label</label
                  >
                  <input
                    type="text"
                    id="agenda-day-label"
                    required
                    placeholder="e.g. Day 1 – Tuesday, 19 May 2026"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Label text (optional, shown under day name on agenda
                    page)</label
                  >
                  <input
                    type="text"
                    id="agenda-day-sublabel"
                    placeholder="e.g. Opening &amp; worship"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Date (YYYY-MM-DD)</label
                  >
                  <input
                    type="text"
                    id="agenda-day-date"
                    required
                    placeholder="2026-05-19"
                    pattern="\d{4}-\d{2}-\d{2}"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Order (optional, number for sorting)</label
                  >
                  <input
                    type="number"
                    id="agenda-day-order"
                    min="0"
                    value="0"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Save day
                </button>
                <button
                  type="button"
                  id="agenda-day-form-cancel"
                  class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            <form
              id="agenda-item-form"
              class="hidden mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3"
            >
              <input type="hidden" id="agenda-item-index" value="" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Time</label
                  >
                  <input
                    type="text"
                    id="agenda-item-time"
                    required
                    placeholder="10:00 AM"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Type</label
                  >
                  <select
                    id="agenda-item-type"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  >
                    <option value="simple">Simple</option>
                    <option value="detailed">Detailed (with speaker)</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Title</label
                >
                <input
                  type="text"
                  id="agenda-item-title"
                  required
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Description (optional)</label
                >
                <textarea
                  id="agenda-item-description"
                  rows="2"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                ></textarea>
              </div>
              <div id="agenda-item-detailed-fields" class="hidden space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Tags (optional, comma-separated e.g. Keynote,
                    Workshop)</label
                  >
                  <input
                    type="text"
                    id="agenda-item-tag"
                    placeholder="Keynote, Workshop"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Speaker name (optional)</label
                    >
                    <input
                      type="text"
                      id="agenda-item-speaker-name"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Speaker role (optional)</label
                    >
                    <input
                      type="text"
                      id="agenda-item-speaker-role"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Speaker image URL (optional)</label
                  >
                  <input
                    type="text"
                    id="agenda-item-speaker-image"
                    placeholder="https://…"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Save session
                </button>
                <button
                  type="button"
                  id="agenda-item-form-cancel"
                  class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>

        <!-- Panel: Merch -->
        <div id="panel-merch" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Merch</h1>
            <p class="text-gray-400 text-sm mb-6">
              Payment details and Google form link are shown on the public merch
              page. Add items with name and price.
            </p>

            <div class="space-y-6">
              <div class="p-4 bg-gray-700/40 rounded-xl border border-gray-600">
                <h2 class="text-sm font-bold text-white mb-3">
                  Payment / transfer details
                </h2>
                <p class="text-gray-400 text-xs mb-4">
                  These appear on the merch page so users know where to pay and
                  where to submit their receipt.
                </p>
                <form id="merch-settings-form" class="space-y-3">
                  <div>
                    <label
                      for="merch-account-number"
                      class="block text-xs font-medium text-gray-400 mb-1"
                      >Account Number</label
                    >
                    <input
                      type="text"
                      id="merch-account-number"
                      placeholder="e.g. 0123456789"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="merch-account-name"
                      class="block text-xs font-medium text-gray-400 mb-1"
                      >Account Name</label
                    >
                    <input
                      type="text"
                      id="merch-account-name"
                      placeholder="e.g. Excellence Conference"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="merch-account-bank"
                      class="block text-xs font-medium text-gray-400 mb-1"
                      >Account Bank</label
                    >
                    <input
                      type="text"
                      id="merch-account-bank"
                      placeholder="e.g. XYZ Bank"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="merch-google-form-link"
                      class="block text-xs font-medium text-gray-400 mb-1"
                      >Google Form Link (Receipt / Contact)</label
                    >
                    <input
                      type="url"
                      id="merch-google-form-link"
                      placeholder="https://docs.google.com/forms/..."
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                  >
                    Save payment details
                  </button>
                </form>
              </div>

              <div class="p-4 bg-gray-700/40 rounded-xl border border-gray-600">
                <h2 class="text-sm font-bold text-white mb-3">Merch items</h2>
                <p class="text-gray-400 text-xs mb-4">
                  Items shown on the merch page with name and price.
                </p>
                <div id="merch-items-list" class="mb-4 space-y-2"></div>
                <button
                  type="button"
                  id="merch-add-item-btn"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Add item
                </button>
                <form
                  id="merch-item-form"
                  class="hidden mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3"
                >
                  <input type="hidden" id="merch-item-id" value="" />
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Name</label
                    >
                    <input
                      type="text"
                      id="merch-item-name"
                      required
                      placeholder="e.g. T-shirt"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Price (e.g. 5000 or 5,000 NGN)</label
                    >
                    <input
                      type="text"
                      id="merch-item-price"
                      required
                      placeholder="5,000 NGN"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Description (optional)</label
                    >
                    <textarea
                      id="merch-item-description"
                      rows="2"
                      placeholder="Size, color options…"
                      class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Images (optional, add multiple for a scrollable
                      catalog)</label
                    >
                    <div
                      id="merch-item-images-list"
                      class="space-y-2 mt-1"
                    ></div>
                    <button
                      type="button"
                      id="merch-item-add-image-btn"
                      class="mt-2 px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 text-xs font-medium"
                    >
                      Add image URL
                    </button>
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="submit"
                      class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                    >
                      Save item
                    </button>
                    <button
                      type="button"
                      id="merch-item-form-cancel"
                      class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>

        <!-- Panel: Workers Dinner -->
        <div id="panel-dinner" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Workers Dinner</h1>
            <p class="text-gray-400 text-sm mb-4">
              Details shown on the public dinner page.
            </p>
            <form id="dinner-settings-form" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Venue name (optional)</label
                >
                <input
                  type="text"
                  id="dinner-venue-name"
                  placeholder="e.g. Grand Ballroom"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Venue address (optional)</label
                >
                <input
                  type="text"
                  id="dinner-venue-address"
                  placeholder="123 Street, City"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Date (optional)</label
                  >
                  <input
                    type="text"
                    id="dinner-date"
                    placeholder="e.g. May 22, 2026"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Time (optional)</label
                  >
                  <input
                    type="text"
                    id="dinner-time"
                    placeholder="e.g. 7:00 PM"
                    class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Description (optional, intro on dinner page)</label
                >
                <textarea
                  id="dinner-description"
                  rows="2"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                  placeholder="Join us for…"
                ></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Map / directions link (optional)</label
                >
                <input
                  type="url"
                  id="dinner-map-link"
                  placeholder="https://…"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
              >
                Save dinner details
              </button>
            </form>
          </section>
        </div>

        <!-- Panel: Venue (main conference) -->
        <div id="panel-venue" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">
              Venue &amp; Location
            </h1>
            <p class="text-gray-400 text-sm mb-4">
              Main conference venue shown on the home page.
            </p>
            <form id="venue-settings-form" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Venue name (optional)</label
                >
                <input
                  type="text"
                  id="venue-name"
                  placeholder="e.g. Excellence Centre"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Address (optional)</label
                >
                <input
                  type="text"
                  id="venue-address"
                  placeholder="Full address"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Map link (optional)</label
                >
                <input
                  type="url"
                  id="venue-map-link"
                  placeholder="https://maps.google.com/…"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
              >
                Save venue
              </button>
            </form>
          </section>
        </div>

        <!-- Panel: Announcements -->
        <div id="panel-announcements" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">
              Announcement banner
            </h1>
            <p class="text-gray-400 text-sm mb-4">
              Time-based marquee at the top of the site. Visible only until the
              end date/time.
            </p>
            <form id="announcement-form" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Message (optional, leave empty to hide banner)</label
                >
                <input
                  type="text"
                  id="announcement-message"
                  placeholder="e.g. Registration opens March 1"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >End date &amp; time (optional, when to hide)</label
                >
                <input
                  type="datetime-local"
                  id="announcement-end"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <p class="text-gray-500 text-xs">
                Leave message empty to hide the banner. End time is optional; if
                set, the banner hides after that time.
              </p>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
              >
                Save announcement
              </button>
            </form>
          </section>
        </div>

        <!-- Panel: FAQ -->
        <div id="panel-faq" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">FAQ</h1>
            <p class="text-gray-400 text-sm mb-4">
              Questions and answers shown on the home page.
            </p>
            <div id="faq-list-admin" class="mb-4 space-y-2"></div>
            <button
              type="button"
              id="faq-add-btn"
              class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
            >
              Add FAQ
            </button>
            <form
              id="faq-item-form"
              class="hidden mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3"
            >
              <input type="hidden" id="faq-item-id" value="" />
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Question</label
                >
                <input
                  type="text"
                  id="faq-item-question"
                  required
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Answer (optional)</label
                >
                <textarea
                  id="faq-item-answer"
                  rows="3"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm resize-none"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  id="faq-item-cancel"
                  class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>

        <!-- Panel: Contact -->
        <div id="panel-contact" class="admin-panel hidden">
          <section
            class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h1 class="text-xl font-bold text-white mb-1">Contact details</h1>
            <p class="text-gray-400 text-sm mb-4">
              Shown on the Contact page (header icon).
            </p>
            <form id="contact-settings-form" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Email (optional)</label
                >
                <input
                  type="email"
                  id="contact-email"
                  placeholder="contact@example.com"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Phone (optional)</label
                >
                <input
                  type="text"
                  id="contact-phone"
                  placeholder="+234 …"
                  class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                />
              </div>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-sm font-medium"
              >
                Save contact
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
