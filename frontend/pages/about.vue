<template>
  <div
    class="relative min-h-screen bg-theme-base text-theme-text font-sans antialiased selection:bg-theme-primary/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-theme-primary/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-theme-secondary/5 rounded-full blur-[100px]"
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
            class="p-10 md:p-12 bg-theme-surface/50 backdrop-blur-xl rounded-2xl border-l-4 border-theme-primary shadow-2xl transition-all duration-500 hover:bg-theme-surface border border-t-theme-border border-r-theme-border border-b-theme-border"
          >
            <Icon
              name="heroicons:sparkles-solid"
              class="text-theme-primary w-10 h-10 mb-6 opacity-80"
            />
            <blockquote
              class="text-2xl md:text-3xl font-display font-bold text-theme-text leading-tight italic uppercase"
            >
              "The light shines in the darkness, and the darkness has not
              overcome it."
            </blockquote>
            <cite
              class="block mt-8 text-theme-primary font-sans font-bold tracking-[0.2em] uppercase text-sm"
              >— JOHN 1:5</cite
            >
          </div>
          <div
            class="absolute -z-10 -top-4 -left-4 w-full h-full bg-theme-primary/5 rounded-2xl blur-xl group-hover:bg-theme-primary/10 transition-colors"
          ></div>
        </div>

        <div class="space-y-8">
          <h2
            class="text-3xl md:text-4xl font-display font-bold text-theme-text uppercase tracking-tight"
          >
            Shining the Light
          </h2>
          <div
            class="space-y-6 text-base md:text-lg text-theme-text-muted leading-relaxed font-light"
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
            <div class="h-px w-12 bg-theme-primary"></div>
            <span
              class="font-sans text-xs font-bold uppercase tracking-widest text-theme-primary"
              >Academic & Spiritual Dominance</span
            >
          </div>
        </div>
      </section>

      <section class="mb-40 relative">
        <div
          class="relative overflow-hidden rounded-3xl bg-theme-surface border border-theme-border p-10 md:p-16 shadow-2xl"
        >
          <div class="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span
                class="text-theme-primary font-sans font-bold text-xs tracking-[0.2em] uppercase mb-4 block"
                >Our Roots</span
              >
              <h2
                class="text-2xl md:text-4xl font-display font-bold text-theme-text uppercase mb-6"
              >
                The Sanctuary
              </h2>
              <p
                class="text-theme-text-muted text-md md:text-lg mb-8 leading-relaxed"
              >
                Join us at the Chapel of Praise, a cathedral of intellectual and
                spiritual fervor located within the serene campus of McPherson
                University.
              </p>
              <div
                class="flex-col gap-4 p-6 rounded-xl bg-theme-base/50 border border-theme-border hover:border-theme-primary/30 transition-all duration-300"
              >
                <div>
                  <LocationButton />
                  <h4
                    class="font-bold text-theme-text text-lg mb-1 uppercase tracking-wide"
                  >
                    Chapel of Praise
                  </h4>
                  <p class="text-sm text-theme-text-muted leading-relaxed">
                    McPherson University, Seriki-Sotayo, Ogun State, Nigeria
                  </p>
                </div>
              </div>
            </div>
            <div
              class="aspect-video md:aspect-square rounded-2xl overflow-hidden relative shadow-2xl group border border-theme-border"
            >
              <AppImage
                src="/img/about_page.jpg"
                alt="Chapel of Praise Atmosphere"
                imgClass="w-full h-full object-cover  transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="mb-30">
        <div class="text-center mb-16">
          <span
            class="text-theme-primary font-sans font-bold text-xs tracking-[0.2em] uppercase mb-4 block"
            >The Steering Council</span
          >
          <h2
            class="text-4xl md:text-5xl font-display font-bold text-theme-text uppercase tracking-tighter mb-4"
          >
            Leadership
          </h2>
          <p class="text-theme-text-muted max-w-xl mx-auto">
            Guided by visionaries who embody the fusion of academic prowess and
            spiritual depth.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="group">
            <div
              class="aspect-square rounded-2xl overflow-hidden border border-theme-border mb-6 relative flex items-center justify-center"
            >
              <!-- Change image -->
              <AppImage
                src="/img/peter-okodugha.jpg"
                alt="Peter Okodugha"
                imgClass="w-full h-full object-cover transition-all duration-500 z-10 object-top"
              />
            </div>
            <h3
              class="font-display font-bold text-2xl text-theme-text mb-1 uppercase group-hover:text-theme-primary transition-colors"
            >
              Peter Okodugha
            </h3>
            <p
              class="text-theme-primary text-xs font-bold uppercase tracking-widest"
            >
              Chairperson, EC'26
            </p>
          </div>

          <div class="group">
            <div
              class="aspect-square rounded-2xl overflow-hidden bg-theme-surface border border-theme-border mb-6 relative flex items-center justify-center"
            >
              <AppImage
                src="/img/slide1.jpeg"
                alt="Rev. Ibiwunmi Alo"
                imgClass="w-full h-full object-cover transition-all duration-500 z-10"
              />
            </div>
            <h3
              class="font-display font-bold text-2xl text-theme-text mb-1 uppercase group-hover:text-theme-primary transition-colors"
            >
              Rev. Ibiwunmi Alo
            </h3>
            <p
              class="text-theme-primary text-xs font-bold uppercase tracking-widest"
            >
              University Chaplain
            </p>
          </div>

          <div
            class="flex flex-col items-center justify-center border-2 border-dashed border-theme-border rounded-2xl p-8 hover:bg-theme-surface hover:border-gray-700 transition-colors group aspect-square"
          >
            <div
              class="w-16 h-16 rounded-full bg-theme-base border border-theme-border flex items-center justify-center mb-6 group-hover:border-theme-primary/50 transition-colors"
            >
              <Icon
                name="heroicons:user-group"
                class="text-theme-text-muted text-2xl group-hover:text-theme-primary transition-colors"
              />
            </div>
            <h3
              class="font-display font-bold text-xl text-theme-text mb-2 uppercase text-center group-hover:text-theme-primary transition-colors"
            >
              Executive Committee
            </h3>
            <p class="text-theme-text-muted text-sm text-center">
              Comprising vision-driven leaders across various faculties and
              spiritual departments.
            </p>
          </div>
        </div>
      </section>

      <section
        class="relative rounded-3xl overflow-hidden py-24 text-center bg-theme-surface border border-theme-border shadow-2xl"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"
        ></div>
        <div class="relative z-10 px-8">
          <span
            class="text-theme-primary font-bold tracking-[0.4em] text-xs uppercase mb-4 block"
            >Save The Date</span
          >
          <h2
            class="text-3xl md:text-4xl font-display font-black text-theme-text mb-8 uppercase leading-tight"
          >
            MAY 19TH, 2026
          </h2>
          <p
            class="text-theme-text-muted text-md md:text-lg font-light mb-10 max-w-2xl mx-auto"
          >
            Experience the Radiance. Witness the Shift. Prepare your heart.
          </p>
          <NuxtLink
            to="/agenda"
            class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-black px-10 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-theme-primary/20 transition-all hover:-translate-y-1 text-md"
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
