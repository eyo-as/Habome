require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { errorMiddleware } = require("./src/middleware/errorMiddleware");
const { validateEnv } = require("./src/utils/validateEnv");

validateEnv();
connectDB();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Habome API running" });
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/properties", require("./src/routes/propertyRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/favorites", require("./src/routes/favoriteRoutes"));
app.use("/api/contact", require("./src/routes/contactRoutes"));
app.use("/api/upload", require("./src/routes/uploadRoutes"));

app.use(errorMiddleware);

const DEFAULT_PORT = Number(process.env.PORT || 5000);

if (require.main === module) {
  app.listen(DEFAULT_PORT, () => {
    console.log(`Habome server running on port ${DEFAULT_PORT}`);
  });
}

module.exports = { app };
