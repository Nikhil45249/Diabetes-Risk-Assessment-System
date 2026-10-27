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
// CORS — dynamic origin check
//   • localhost for dev
//   • Any Vercel preview / production URL for the project
//   • Optional FRONTEND_URL env-var override
// ---------------------------------------------------------------------------
const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,                          // local dev (any port)
  /^https:\/\/diabetes-risk-assessment-system[^.]*\.vercel\.app$/, // all Vercel deploys
];

function isOriginAllowed(origin) {
  if (!origin) return true;                              // non-browser clients (curl, Postman)
  if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
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
  console.log(`   CORS: localhost + *.vercel.app${process.env.FRONTEND_URL ? ` + ${process.env.FRONTEND_URL}` : ""}\n`);
});
