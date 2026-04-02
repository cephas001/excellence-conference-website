const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean), // This safely removes undefined values if FRONTEND_URL is missing
  }),
); // Allows frontend to make requests to this API
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
