const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const speakersRoutes = require("./routes/speakers");
const testimoniesRoutes = require("./routes/testimonies");
const agendaRoutes = require("./routes/agenda");
const merchRoutes = require("./routes/merch");
const merchSettingsRoutes = require("./routes/merchSettings");
const eventSettingsRoutes = require("./routes/eventSettings");
const faqRoutes = require("./routes/faq");

// Mount API Routes
app.use("/api/speakers", speakersRoutes);
app.use("/api/testimonies", testimoniesRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/merch-settings", merchSettingsRoutes);
app.use("/api/event-settings", eventSettingsRoutes);
app.use("/api/faq", faqRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Excellence Conference API running on port ${PORT}`);
});
