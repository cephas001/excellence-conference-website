const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 1. Clean the environment variables: remove spaces and trailing slashes
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) =>
      url.trim().replace(/\/$/, ""),
    )
  : [];

const allowedOrigins = ["http://localhost:3000", ...envOrigins];

app.use(
  cors({
    // 2. Use a function to dynamically check the origin
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Nuxt SSR!)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    // 3. Ensure credentials are allowed if you are using cookies/sessions
    credentials: true,
    // 4. Force the browser to cache the preflight response for 10 minutes so it stops asking
    maxAge: 600,
  }),
);

app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Import Routes
const speakersRoutes = require("./routes/speakers");
const testimoniesRoutes = require("./routes/testimonies");
const agendaRoutes = require("./routes/agenda");
const merchRoutes = require("./routes/merch");
const merchSettingsRoutes = require("./routes/merchSettings");
const eventSettingsRoutes = require("./routes/eventSettings");
const faqRoutes = require("./routes/faq");
const authRoutes = require("./routes/auth");
const applicationRoutes = require("./routes/applications");

// Mount API Routes
app.use("/api/speakers", speakersRoutes);
app.use("/api/testimonies", testimoniesRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/merch-settings", merchSettingsRoutes);
app.use("/api/event-settings", eventSettingsRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Excellence Conference API running on port ${PORT}`);
});
