import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        agenda: './agenda.html',
        admin: './admin.html',
        dinner: './dinner.html',
        merch: './merch.html',
      },
    },
  },
});

