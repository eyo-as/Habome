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

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Habome server running on port ${PORT}`);
  });
}

module.exports = { app };
