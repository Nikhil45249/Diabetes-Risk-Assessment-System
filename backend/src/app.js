/**
 * Express application — central API layer for the Diabetes Risk Assessment System.
 *
 * Responsibilities:
 *  - Parse & validate incoming JSON from the React frontend
 *  - Forward valid feature payloads to the Python FastAPI ML service
 *  - Return consistent JSON responses and error shapes
 *  - Configure CORS for the React dev origin
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const assessmentRoutes = require("./routes/assessment");
const modelRoutes = require("./routes/model");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Allowed CORS origins — includes local dev + deployed Vercel frontend
// ---------------------------------------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://diabetes-risk-assessment-system-9jmnzx1df-nikhil45249s-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));

// Request logger (development)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method}  ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/health", healthRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/model", modelRoutes);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   ML service URL: ${process.env.ML_SERVICE_URL || "http://127.0.0.1:8000"}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}\n`);
});
