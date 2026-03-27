// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Nuxt defaults to 3000, so use 5000 for the API

app.use(cors());
app.use(express.json());

// A test route to make sure it's working
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running smoothly" });
});

// Future admin routes will be imported here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
