require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { errorMiddleware } = require("./src/middleware/errorMiddleware");
const { validateEnv } = require("./src/utils/validateEnv");

// Validate environment variables on startup
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/properties", require("./src/routes/propertyRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/favorites", require("./src/routes/favoriteRoutes"));
app.use("/api/contact", require("./src/routes/contactRoutes"));
app.use("/api/upload", require("./src/routes/uploadRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Habome API running" });
});

// Centralized error handler — must be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Habome server running on port ${PORT}`);
});
