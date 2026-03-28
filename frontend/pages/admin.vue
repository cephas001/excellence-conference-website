<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30"
  >
    <div
      v-if="!isAuthenticated"
      class="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center p-4"
    >
      <div
        class="w-full max-w-md p-[1px] bg-gradient-to-br from-orange-500/30 to-transparent rounded-2xl"
      >
        <div
          class="bg-gray-900 rounded-[calc(1rem-1px)] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div
            class="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"
          ></div>

          <div class="text-center mb-10 relative z-10">
            <div
              class="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon
                name="heroicons:shield-check-solid"
                class="text-orange-500 w-10 h-10"
              />
            </div>
            <h2
              class="font-display text-3xl font-extrabold text-white mb-2 uppercase tracking-wide"
            >
              Admin Access
            </h2>
            <p class="text-gray-400 text-sm">Excellence Conference Backend</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
            <div class="space-y-1.5">
              <label
                class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1"
                >Email Address</label
              >
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-600"
                placeholder="admin@excellence.org"
              />
            </div>
            <div class="space-y-1.5">
              <label
                class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1"
                >Password</label
              >
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>

            <p
              v-if="loginError"
              class="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-md border border-red-900/50"
            >
              {{ loginError }}
            </p>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-4 rounded-xl text-black font-bold text-base uppercase tracking-widest shadow-[0_15px_30px_rgba(249,115,22,0.2)] transition-all"
            >
              {{ isLoading ? "Authenticating..." : "Sign In" }}
            </button>

            <div class="text-center mt-6">
              <NuxtLink
                to="/"
                class="text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="heroicons:arrow-left" class="w-4 h-4" /> Back to
                Website
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="flex h-screen overflow-hidden bg-gray-950">
      <aside
        class="hidden lg:flex flex-col w-72 border-r border-gray-800 bg-gray-900 overflow-y-auto shadow-2xl z-20"
      >
        <div class="p-8 pb-6">
          <h1
            class="text-2xl font-display font-bold tracking-tighter text-orange-500 uppercase"
          >
            Majestic Admin
          </h1>
          <p
            class="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1 uppercase"
          >
            Conference Manager
          </p>
        </div>

        <nav class="flex flex-col gap-1 pr-4 flex-grow">
          <button
            v-for="nav in navigation"
            :key="nav.id"
            @click="activePanel = nav.id"
            class="flex items-center gap-3 px-6 py-3.5 transition-all duration-300 w-full text-left"
            :class="
              activePanel === nav.id
                ? 'text-orange-500 bg-orange-500/10 rounded-r-full font-semibold border-l-4 border-orange-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-r-full border-l-4 border-transparent'
            "
          >
            <Icon :name="nav.icon" class="w-5 h-5 shrink-0" />
            <span class="font-medium text-sm tracking-wide">{{
              nav.label
            }}</span>
          </button>
        </nav>

        <div class="p-6 border-t border-gray-800 mt-auto">
          <div
            class="flex items-center gap-3 mb-6 bg-gray-950 p-3 rounded-xl border border-gray-800"
          >
            <div
              class="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold"
            >
              A
            </div>
            <div class="overflow-hidden">
              <p class="text-sm font-semibold text-white truncate">
                Admin User
              </p>
              <p class="text-xs text-gray-500">Conference Lead</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

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

        <div v-if="activePanel === 'speakers'" class="animate-fade-in">
          <header class="mb-10">
            <h2
              class="font-display text-4xl font-bold text-white tracking-tight mb-2 uppercase"
            >
              Speakers
            </h2>
            <p class="text-gray-400">
              Manage keynote speakers, ministerial roles, and session topics for
              2026.
            </p>
          </header>

          <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <section class="xl:col-span-8 space-y-4">
              <div
                v-if="speakers.length === 0"
                class="border-2 border-dashed border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-500 bg-gray-900/50"
              >
                <Icon
                  name="heroicons:user-plus"
                  class="w-12 h-12 mb-4 opacity-50"
                />
                <p class="font-medium tracking-wide">No speakers added yet.</p>
              </div>

              <div
                v-for="speaker in speakers"
                :key="speaker.id"
                class="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 transition-all hover:border-gray-700 hover:shadow-xl"
              >
                <div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
                <div
                  class="flex flex-col sm:flex-row items-start justify-between gap-6"
                >
                  <div class="flex gap-5 items-start">
                    <div
                      class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden shadow-lg border border-gray-700 shrink-0 bg-gray-950"
                    >
                      <img
                        v-if="speaker.image"
                        :src="speaker.image"
                        :alt="speaker.name"
                        class="w-full h-full object-cover"
                      />
                      <Icon
                        v-else
                        name="heroicons:user"
                        class="w-full h-full p-4 text-gray-600"
                      />
                    </div>
                    <div>
                      <h3
                        class="font-display text-xl font-bold text-white mb-1 uppercase"
                      >
                        {{ speaker.name }}
                      </h3>
                      <p
                        class="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3"
                      >
                        {{ speaker.role || "No Role Specified" }}
                      </p>
                      <div
                        class="flex items-center gap-2 text-gray-400 text-sm mb-4"
                      >
                        <Icon name="heroicons:academic-cap" class="w-4 h-4" />
                        <span class="truncate max-w-[200px] sm:max-w-md">{{
                          speaker.topic || "No topic assigned"
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 mt-4 sm:mt-0"
                  >
                    <button
                      @click="editItem(speaker, speakerForm)"
                      class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-xs font-semibold uppercase tracking-wider border border-gray-700"
                    >
                      <Icon name="heroicons:pencil-square" class="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      @click="deleteItem(speaker.id, speakers)"
                      class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider border border-red-900/30"
                    >
                      <Icon name="heroicons:trash" class="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside class="xl:col-span-4">
              <div
                class="sticky top-10 rounded-2xl bg-gray-900 p-6 sm:p-8 border border-gray-800 shadow-2xl"
              >
                <h3
                  class="font-display text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide"
                >
                  <Icon
                    name="heroicons:pencil-square"
                    class="text-orange-500 w-6 h-6"
                  />
                  {{ speakerForm.id ? "Edit Speaker" : "Add New Speaker" }}
                </h3>
                <form
                  @submit.prevent="saveItem(speakerForm, speakers)"
                  class="space-y-4"
                >
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Full Name *</label
                    ><input
                      v-model="speakerForm.name"
                      type="text"
                      required
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm placeholder:text-gray-600"
                      placeholder="e.g. Dr. Jane Doe"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Role / Designation</label
                    ><input
                      v-model="speakerForm.role"
                      type="text"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm placeholder:text-gray-600"
                      placeholder="Keynote Speaker"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Topic</label
                    ><input
                      v-model="speakerForm.topic"
                      type="text"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm placeholder:text-gray-600"
                      placeholder="Enter session title"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Image URL</label
                    ><input
                      v-model="speakerForm.image"
                      type="text"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm placeholder:text-gray-600"
                      placeholder="/img/speaker.jpg"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Biography</label
                    ><textarea
                      v-model="speakerForm.bio"
                      rows="3"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all text-sm placeholder:text-gray-600 resize-none"
                    ></textarea>
                  </div>

                  <div class="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      class="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 py-3 rounded-xl text-black font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
                    >
                      Save Profile
                    </button>
                    <button
                      v-if="speakerForm.id"
                      @click="resetForm(speakerForm)"
                      type="button"
                      class="px-6 bg-gray-800 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>

        <div v-if="activePanel === 'testimonies'" class="animate-fade-in">
          <header class="mb-10">
            <h2
              class="font-display text-4xl font-bold text-white tracking-tight mb-2 uppercase"
            >
              Testimonies
            </h2>
            <p class="text-gray-400">
              Manage attendee testimonies shown on the home page.
            </p>
          </header>

          <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <section class="xl:col-span-8 space-y-4">
              <div
                v-for="testimony in testimonies"
                :key="testimony.id"
                class="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 transition-all hover:border-gray-700"
              >
                <div
                  class="flex flex-col sm:flex-row items-start justify-between gap-6"
                >
                  <div>
                    <h3
                      class="font-display text-xl font-bold text-white mb-1 uppercase"
                    >
                      {{ testimony.name }}
                    </h3>
                    <p
                      class="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3"
                    >
                      {{ testimony.location }}
                    </p>
                    <p
                      class="text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3"
                    >
                      "{{ testimony.testimony }}"
                    </p>
                  </div>
                  <div class="flex sm:flex-col gap-2 shrink-0">
                    <button
                      @click="editItem(testimony, testimonyForm)"
                      class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold uppercase border border-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteItem(testimony.id, testimonies)"
                      class="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-semibold uppercase border border-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside class="xl:col-span-4">
              <div
                class="sticky top-10 rounded-2xl bg-gray-900 p-6 sm:p-8 border border-gray-800 shadow-2xl"
              >
                <h3
                  class="font-display text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide"
                >
                  <Icon
                    name="heroicons:pencil-square"
                    class="text-orange-500 w-6 h-6"
                  />
                  {{ testimonyForm.id ? "Edit Testimony" : "Add Testimony" }}
                </h3>
                <form
                  @submit.prevent="saveItem(testimonyForm, testimonies)"
                  class="space-y-4"
                >
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Name *</label
                    ><input
                      v-model="testimonyForm.name"
                      type="text"
                      required
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Year / Location</label
                    ><input
                      v-model="testimonyForm.location"
                      type="text"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm"
                      placeholder="e.g. 2025 Attendee"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1"
                      >Quote *</label
                    ><textarea
                      v-model="testimonyForm.testimony"
                      required
                      rows="4"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm resize-none"
                    ></textarea>
                  </div>
                  <div class="pt-4 flex gap-3">
                    <button
                      type="submit"
                      class="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 py-3 rounded-xl text-black font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
                    >
                      Save
                    </button>
                    <button
                      v-if="testimonyForm.id"
                      @click="resetForm(testimonyForm)"
                      type="button"
                      class="px-6 bg-gray-800 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs border border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>

        <div v-if="activePanel === 'merch'" class="animate-fade-in">
          <header class="mb-10">
            <h2
              class="font-display text-4xl font-bold text-white tracking-tight mb-2 uppercase"
            >
              Merchandise
            </h2>
            <p class="text-gray-400">
              Manage the online store catalog and payment instructions.
            </p>
          </header>

          <section
            class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8"
          >
            <h3
              class="font-display text-xl font-bold text-white mb-4 uppercase"
            >
              Payment & Order Config
            </h3>
            <form @submit.prevent="alertSave" class="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                  >Bank Name</label
                ><input
                  v-model="merchSettings.accountBank"
                  type="text"
                  class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                />
              </div>
              <div>
                <label
                  class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                  >Account Number</label
                ><input
                  v-model="merchSettings.accountNumber"
                  type="text"
                  class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                />
              </div>
              <div>
                <label
                  class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                  >Account Name</label
                ><input
                  v-model="merchSettings.accountName"
                  type="text"
                  class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                />
              </div>
              <div>
                <label
                  class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                  >Google Form Link</label
                ><input
                  v-model="merchSettings.googleFormLink"
                  type="url"
                  class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                />
              </div>
              <div class="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  class="bg-gray-800 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-700 hover:bg-gray-700"
                >
                  Save Config
                </button>
              </div>
            </form>
          </section>

          <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <section class="xl:col-span-8 space-y-4">
              <div
                v-for="item in merchItems"
                :key="item.id"
                class="flex flex-col sm:flex-row items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4"
              >
                <div
                  class="w-20 h-20 bg-gray-950 rounded-lg border border-gray-800 shrink-0 overflow-hidden"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-grow text-center sm:text-left">
                  <h3 class="font-bold text-white uppercase">
                    {{ item.name }}
                  </h3>
                  <p class="text-orange-500 font-bold text-sm">
                    {{ item.price }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="editItem(item, merchForm)"
                    class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold uppercase border border-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteItem(item.id, merchItems)"
                    class="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-semibold uppercase border border-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </section>

            <aside class="xl:col-span-4">
              <div
                class="sticky top-10 rounded-2xl bg-gray-900 p-6 border border-gray-800 shadow-2xl"
              >
                <h3
                  class="font-display text-xl font-bold text-white mb-6 uppercase tracking-wide"
                >
                  {{ merchForm.id ? "Edit Product" : "Add Product" }}
                </h3>
                <form
                  @submit.prevent="saveItem(merchForm, merchItems)"
                  class="space-y-4"
                >
                  <div>
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                      >Product Name</label
                    ><input
                      v-model="merchForm.name"
                      type="text"
                      required
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                      >Price (₦)</label
                    ><input
                      v-model="merchForm.price"
                      type="text"
                      required
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                      placeholder="e.g. ₦15,000"
                    />
                  </div>
                  <div>
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                      >Image URL</label
                    ><input
                      v-model="merchForm.image"
                      type="text"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label
                      class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                      >Description</label
                    ><textarea
                      v-model="merchForm.description"
                      rows="2"
                      class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1 resize-none"
                    ></textarea>
                  </div>
                  <div class="pt-2 flex gap-3">
                    <button
                      type="submit"
                      class="flex-1 bg-orange-500 text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                      Save
                    </button>
                    <button
                      v-if="merchForm.id"
                      @click="resetForm(merchForm)"
                      type="button"
                      class="px-6 bg-gray-800 text-white rounded-xl font-bold uppercase text-xs border border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>

        <div
          v-if="activePanel === 'settings'"
          class="animate-fade-in max-w-4xl"
        >
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
                <Icon
                  name="heroicons:map-pin"
                  class="w-6 h-6 text-orange-500"
                />
                Main Venue
              </h3>
              <form
                @submit.prevent="alertSave"
                class="grid sm:grid-cols-2 gap-4"
              >
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Venue Name</label
                  ><input
                    v-model="venueSettings.name"
                    type="text"
                    class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Google Maps Link</label
                  ><input
                    v-model="venueSettings.mapLink"
                    type="url"
                    class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Full Address</label
                  ><input
                    v-model="venueSettings.address"
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
                <Icon
                  name="heroicons:sparkles"
                  class="w-6 h-6 text-orange-500"
                />
                Workers Dinner
              </h3>
              <form
                @submit.prevent="alertSave"
                class="grid sm:grid-cols-2 gap-4"
              >
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Location / Room</label
                  ><input
                    v-model="dinnerSettings.venueName"
                    type="text"
                    class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm mt-1"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Date & Time</label
                  ><input
                    v-model="dinnerSettings.dateTime"
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
                <Icon
                  name="heroicons:megaphone"
                  class="w-6 h-6 text-orange-500"
                />
                Global Announcement Banner
              </h3>
              <form @submit.prevent="alertSave" class="space-y-4">
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500"
                    >Banner Text (Leave blank to hide)</label
                  ><input
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// --- Global App State ---
const isAuthenticated = ref(false); // Toggle to test login vs dashboard
const isLoading = ref(false);
const loginError = ref("");
const loginForm = ref({ email: "", password: "" });

const activePanel = ref("speakers");
const navigation = [
  { id: "speakers", label: "Speakers", icon: "heroicons:microphone" },
  {
    id: "testimonies",
    label: "Testimonies",
    icon: "heroicons:chat-bubble-left-right",
  },
  { id: "merch", label: "Merchandise", icon: "heroicons:shopping-bag" },
  { id: "settings", label: "Event Settings", icon: "heroicons:cog-8-tooth" },
];

const handleLogin = () => {
  isLoading.value = true;
  loginError.value = "";
  // Mock Auth Delay
  setTimeout(() => {
    isAuthenticated.value = true;
    isLoading.value = false;
  }, 800);
};

const handleLogout = () => {
  isAuthenticated.value = false;
};

// --- Generic CRUD Logic ---
// Generates a random ID for mock new items
const generateId = () => Math.random().toString(36).substr(2, 9);

const resetForm = (formRef) => {
  Object.keys(formRef).forEach((key) => {
    formRef[key] = "";
  });
};

const editItem = (item, formRef) => {
  Object.assign(formRef, item);
};

const deleteItem = (id, listRef) => {
  if (confirm("Are you sure you want to delete this item?")) {
    const index = listRef.findIndex((i) => i.id === id);
    if (index !== -1) listRef.splice(index, 1);
  }
};

const saveItem = (formRef, listRef) => {
  if (formRef.id) {
    // Update existing
    const index = listRef.findIndex((i) => i.id === formRef.id);
    if (index !== -1) listRef[index] = { ...formRef };
  } else {
    // Create new
    listRef.push({ ...formRef, id: generateId() });
  }
  resetForm(formRef);
};

const alertSave = () => {
  alert("Settings saved successfully! (Mock)");
};

// --- MOCK DATABASE ARRAYS (Using your provided context) ---

// 1. Speakers [cite: 1, 4]
const speakers = ref([
  {
    id: "s1",
    name: "Rev. Ibiwunmi Alo",
    role: "University Chaplain",
    topic: "Opening Ceremony",
    image: "/img/slide1.jpeg",
    bio: "Building a people of excellence and integrity for service.",
  },
  {
    id: "s2",
    name: "Minister Taiwo Ibidapo",
    role: "Guest Minister",
    topic: "Worship Session: Shining the Light",
    image: "/img/slide4.jpeg",
    bio: "Worship Session on Thursday, 21st May, 2026.",
  },
]);
const speakerForm = ref({
  id: "",
  name: "",
  role: "",
  topic: "",
  image: "",
  bio: "",
});

// 2. Testimonies
const testimonies = ref([
  {
    id: "t1",
    name: "David O.",
    location: "2025 Attendee",
    testimony:
      "The light I received at last year's conference completely transformed my academic journey.",
  },
  {
    id: "t2",
    name: "Mary A.",
    location: "2025 Attendee",
    testimony:
      "I came feeling burnt out, but the teachings renewed my strength.",
  },
]);
const testimonyForm = ref({ id: "", name: "", location: "", testimony: "" });

// 3. Merch
const merchItems = ref([
  {
    id: "m1",
    name: "Premium Hoodie",
    price: "₦15,000",
    description: "Heavyweight cotton-blend fabric.",
    image: "/img/slide4.jpeg",
  },
  {
    id: "m2",
    name: "Minimalist T-Shirt",
    price: "₦7,000",
    description: "Premium organic cotton.",
    image: "/img/slide3.jpeg",
  },
]);
const merchForm = ref({
  id: "",
  name: "",
  price: "",
  description: "",
  image: "",
});

const merchSettings = ref({
  accountBank: "Guaranty Trust Bank (GTB)",
  accountNumber: "0123456789",
  accountName: "McPherson Chapel Of Praise",
  googleFormLink: "https://forms.google.com/...",
});

// 4. Event Settings
const venueSettings = ref({
  name: "McPherson University Chapel", // [cite: 1, 8]
  address: "Seriki-Sotayo, Ogun State, Nigeria.", // [cite: 1, 2, 3]
  mapLink: "https://maps.google.com",
});

const dinnerSettings = ref({
  venueName: "University Grand Pavilion",
  dateTime: "Sunday, May 24th, 2026 at 6:00 PM",
});

const announcement = ref(
  "Welcome to the Excellence Conference 2026 Admin Portal.",
);
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
