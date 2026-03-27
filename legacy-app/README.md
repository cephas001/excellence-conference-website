# Excellence Conference

Static site for Excellence Conference (Vite, HTML, Tailwind, vanilla JS). Content for speakers and testimonies is loaded from Firebase Firestore.

## Local development

```bash
npm install
cp .env.example .env   # then add your Firebase config values
npm run dev
```

## Hidden admin page

There is an **admin panel** for managing speakers and testimonies. It is **not linked anywhere** on the public site. Access it only by going directly to:

- **URL:** `https://<your-domain>/admin.html` (or `http://localhost:5173/admin.html` in dev)

Sign in with the Firebase Auth email/password configured for the project. Do not add links to the admin page from the public site.

## Firebase Console

- Go to [Firebase Console](https://console.firebase.google.com), select the project used by this app.
- **Firestore Database:** `speakers` and `testimonies` collections; adjust rules as needed (e.g. allow write only when `request.auth != null`).
- **Authentication:** Enable Email/Password and create the admin user(s) that can sign in to the admin panel.
- **Project settings → General → Your apps:** Copy the web app config into `.env` as `VITE_FIREBASE_*` (see `.env.example`).

## Deploy

Build output is in `dist/`:

```bash
npm run build
```

Deploy the contents of `dist/` to your host (e.g. Vercel, Netlify, or Firebase Hosting). Ensure the deployment serves `index.html` at `/`, `agenda.html` at `/agenda.html`, and `admin.html` at `/admin.html` (no SPA redirect for these paths). Set the same `VITE_FIREBASE_*` environment variables in your hosting dashboard so the build has the Firebase config.
