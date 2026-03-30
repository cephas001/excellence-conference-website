<template>
  <div
    class="relative min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <AppPageHeader
        plainText="About"
        styledText="EC 2026"
        description="A gathering dedicated to raising giants who will dominate their spheres through the uncompromised light of truth."
      />

      <section class="grid lg:grid-cols-2 gap-16 items-center mb-35">
        <div class="relative group">
          <div
            class="p-10 md:p-12 bg-gray-900/50 backdrop-blur-xl rounded-2xl border-l-4 border-orange-500 shadow-2xl transition-all duration-500 hover:bg-gray-900 border border-t-gray-800 border-r-gray-800 border-b-gray-800"
          >
            <Icon
              name="heroicons:sparkles-solid"
              class="text-orange-500 w-10 h-10 mb-6 opacity-80"
            />
            <blockquote
              class="text-2xl md:text-3xl font-display font-bold text-white leading-tight italic uppercase"
            >
              "The light shines in the darkness, and the darkness has not
              overcome it."
            </blockquote>
            <cite
              class="block mt-8 text-orange-500 font-sans font-bold tracking-[0.2em] uppercase text-sm"
              >— JOHN 1:5</cite
            >
          </div>
          <div
            class="absolute -z-10 -top-4 -left-4 w-full h-full bg-orange-500/5 rounded-2xl blur-xl group-hover:bg-orange-500/10 transition-colors"
          ></div>
        </div>

        <div class="space-y-8">
          <h2
            class="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight"
          >
            Shining the Light
          </h2>
          <div
            class="space-y-6 text-base md:text-lg text-gray-400 leading-relaxed font-light"
          >
            <p>
              At Excellence 2026, we believe that true brilliance is born when
              divine spiritual insight meets rigorous academic discipline. This
              year's theme focuses on the dual mandate of the believer: to be
              both a light in spiritual darkness and a pioneer in professional
              excellence.
            </p>
            <p>
              We are curating an ecosystem where students and professionals can
              shed the limitations of mediocrity. Through intentional sessions
              and apostolic impartation, we bridge the gap between faith and
              career dominance.
            </p>
          </div>
          <div class="flex items-center gap-4 pt-4">
            <div class="h-px w-12 bg-orange-500"></div>
            <span
              class="font-sans text-xs font-bold uppercase tracking-widest text-orange-400"
              >Academic & Spiritual Dominance</span
            >
          </div>
        </div>
      </section>

      <section class="mb-40 relative">
        <div
          class="relative overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 p-10 md:p-16 shadow-2xl"
        >
          <div class="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span
                class="text-orange-500 font-sans font-bold text-xs tracking-[0.2em] uppercase mb-4 block"
                >Our Roots</span
              >
              <h2
                class="text-2xl md:text-4xl font-display font-bold text-white uppercase mb-6"
              >
                The Sanctuary
              </h2>
              <p class="text-gray-400 text-md md:text-lg mb-8 leading-relaxed">
                Join us at the Chapel of Praise, a cathedral of intellectual and
                spiritual fervor located within the serene campus of McPherson
                University.
              </p>
              <div
                class="flex-col gap-4 p-6 rounded-xl bg-gray-950/50 border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
              >
                <div>
                  <LocationButton />
                  <h4
                    class="font-bold text-white text-lg mb-1 uppercase tracking-wide"
                  >
                    Chapel of Praise
                  </h4>
                  <p class="text-sm text-gray-500 leading-relaxed">
                    McPherson University, Seriki-Sotayo, Ogun State, Nigeria
                  </p>
                </div>
              </div>
            </div>
            <div
              class="aspect-video md:aspect-square rounded-2xl overflow-hidden relative shadow-2xl group border border-gray-800"
            >
              <AppImage
                src="/img/about_page.jpg"
                alt="Chapel of Praise Atmosphere"
                imgClass="w-full h-full object-cover  transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-30">
        <div class="text-center mb-16">
          <span
            class="text-orange-500 font-sans font-bold text-xs tracking-[0.2em] uppercase mb-4 block"
            >The Steering Council</span
          >
          <h2
            class="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter mb-4"
          >
            Leadership
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Guided by visionaries who embody the fusion of academic prowess and
            spiritual depth.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="group">
            <div
              class="aspect-square rounded-2xl overflow-hidden border border-gray-800 mb-6 relative flex items-center justify-center"
            >
              <!-- Change image -->
              <AppImage
                src="/img/peter-okodugha.jpg"
                alt="Peter Okodugha"
                imgClass="w-full h-full object-cover transition-all duration-500 z-10 object-top"
              />
              <div
                class="absolute inset-0 bg-gray-950/50 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"
              ></div>
            </div>
            <h3
              class="font-display font-bold text-2xl text-white mb-1 uppercase group-hover:text-orange-500 transition-colors"
            >
              Peter Okodugha
            </h3>
            <p
              class="text-orange-500 text-xs font-bold uppercase tracking-widest"
            >
              Chairperson, EC'26
            </p>
          </div>

          <div class="group">
            <div
              class="aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-6 relative flex items-center justify-center"
            >
              <AppImage
                src="/img/slide1.jpeg"
                alt="Rev. Ibiwunmi Alo"
                imgClass="w-full h-full object-cover transition-all duration-500 z-10"
              />
              <div
                class="absolute inset-0 bg-gray-950/50 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"
              ></div>
            </div>
            <h3
              class="font-display font-bold text-2xl text-white mb-1 uppercase group-hover:text-orange-500 transition-colors"
            >
              Rev. Ibiwunmi Alo
            </h3>
            <p
              class="text-orange-500 text-xs font-bold uppercase tracking-widest"
            >
              University Chaplain
            </p>
          </div>

          <div
            class="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl p-8 hover:bg-gray-900 hover:border-gray-700 transition-colors group aspect-square"
          >
            <div
              class="w-16 h-16 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center mb-6 group-hover:border-orange-500/50 transition-colors"
            >
              <Icon
                name="heroicons:user-group"
                class="text-gray-500 text-2xl group-hover:text-orange-500 transition-colors"
              />
            </div>
            <h3
              class="font-display font-bold text-xl text-white mb-2 uppercase text-center group-hover:text-orange-500 transition-colors"
            >
              Executive Committee
            </h3>
            <p class="text-gray-500 text-sm text-center">
              Comprising vision-driven leaders across various faculties and
              spiritual departments.
            </p>
          </div>
        </div>
      </section>

      <section
        class="relative rounded-3xl overflow-hidden py-24 text-center bg-gray-900 border border-gray-800 shadow-2xl"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"
        ></div>
        <div class="relative z-10 px-8">
          <span
            class="text-orange-500 font-bold tracking-[0.4em] text-xs uppercase mb-4 block"
            >Save The Date</span
          >
          <h2
            class="text-3xl md:text-4xl font-display font-black text-white mb-8 uppercase leading-tight"
          >
            MAY 19TH, 2026
          </h2>
          <p
            class="text-gray-400 text-md md:text-lg font-light mb-10 max-w-2xl mx-auto"
          >
            Experience the Radiance. Witness the Shift. Prepare your heart.
          </p>
          <NuxtLink
            to="/agenda"
            class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-10 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-1 text-md"
          >
            SEE AGENDA
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// No complex reactive logic needed for this static page!
</script>
