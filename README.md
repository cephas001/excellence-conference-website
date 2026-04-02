# 🌟 Excellence Conference 2026

![Status](https://img.shields.io/badge/Status-Active-success)
![Architecture](https://img.shields.io/badge/Architecture-Monorepo-blue)
![Stack](https://img.shields.io/badge/Stack-Nuxt_|_Express_|_Firebase-orange)

Welcome to the official monorepo for the **Excellence Conference**. This centralized repository houses the complete digital ecosystem for the event, including the public-facing website, the secure administrative portal, and the unified backend API.

---

## 🏗️ Monorepo Architecture

By utilizing a monorepo structure, we ensure seamless API integration, shared backend logic, and simplified deployment pipelines. The repository is divided into three primary workspaces:

- **`/frontend`** — The public-facing website for the conference. Attendees use this client to view agendas, purchase merchandise, and register for events.
- **`/admin_frontend`** — The secure Admin System portal. A dedicated Nuxt.js application where authorized administrators (Admins/Super Admins) make changes to the website.
- **`/backend`** — The unified Express.js API. It handles business logic, securely communicates with Firebase Auth/Firestore, and serves both the public frontend and the admin portal via namespaced routes.

## 🛠️ Tech Stack

- **Frontends:** Nuxt 3, Vue.js, Tailwind CSS, Firebase Client SDK
- **Backend:** Node.js, Express.js, Firebase Admin SDK
- **Database & Auth:** Google Cloud Firestore (NoSQL), Firebase Authentication (Custom Claims)
- **Hosting:** Vercel (Frontends), Render (Backend)

---

## 🚀 Local Development Setup

To run the full ecosystem on your local machine, you will need to run the backend and both frontends concurrently.

### Prerequisites

- Node.js (v18+ recommended)
- A Firebase Project with Firestore and Authentication enabled.

### 1. Installation

Clone the repository and install dependencies for all three workspaces:

```bash
git clone [https://github.com/cephas001/excellence-conference-website.git](https://github.com/cephas001/excellence-conference-website.git)
cd excellence-conference-website

# Install Backend dependencies
cd backend && npm install && cd ..

# Install Public Frontend dependencies
cd frontend && npm install && cd ..

# Install Admin Frontend dependencies
cd admin_frontend && npm install && cd ..
```
