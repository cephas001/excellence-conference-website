# Excellence Conference 2026 Platform

The official web platform and administrative dashboard for the **Excellence Conference 2026: Shining the Light**. This platform handles attendee information, the event schedule, official merchandise pre-orders, and global event settings.

## 🚀 Tech Stack

- **Frontend:** Nuxt 3 (Vue.js), Tailwind CSS
- **Backend:** Express.js, Node.js
- **Design System:** Custom "Stitch" dark-theme aesthetic (gray-950 background, orange/yellow gradients, Heroicons).

## 📁 Architecture Overview

The frontend is highly modularized to ensure maximum performance and maintainability:

- `pages/`: Contains the main routes (`index.vue`, `agenda.vue`, `merch.vue`, `contact.vue`, `about.vue`, `dinner.vue`).
- `pages/admin.vue`: The secure, overarching entry point for the backend management portal.
- `components/admin/`: Self-contained admin panels (Speakers, Testimonies, Merch, Settings) that dynamically mount to prevent heavy data fetching on initial load.
- `composables/`: Reusable logic, including `useConferenceData` (API fetching) and `useAdminMutations` (database updates).

---

## 💻 Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone & Install

```bash
git clone [https://github.com/cephas001/excellence-conference-website.git](https://github.com/cephas001/excellence-conference-website.git)
cd excellence-conference-website
cd frontend
npm install
cd backend
npm install
```
