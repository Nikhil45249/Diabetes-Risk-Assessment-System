/**
 * Service layer for communicating with the Python FastAPI ML service.
 */

const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
const TIMEOUT_MS = 15_000; // 15-second timeout

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

/**
 * Check ML service health.
 */
async function checkHealth() {
  const { data } = await mlClient.get("/health");
  return data;
}

/**
 * Send questionnaire features to the ML service for prediction.
 */
async function getPrediction(features) {
  const { data } = await mlClient.post("/predict", features);
  return data;
}

/**
 * Retrieve model metadata and evaluation metrics.
 */
async function getModelInfo() {
  const { data } = await mlClient.get("/model-info");
  return data;
}

module.exports = { checkHealth, getPrediction, getModelInfo };
