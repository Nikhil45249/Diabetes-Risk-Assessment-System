import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Check the backend + ML service health.
 */
export async function checkHealth() {
  const { data } = await apiClient.get("/health");
  return data;
}

/**
 * Submit the questionnaire for prediction.
 * @param {object} formData - All questionnaire fields
 */
export async function submitAssessment(formData) {
  const { data } = await apiClient.post("/assessment/predict", formData);
  return data;
}

/**
 * Get model metadata and evaluation metrics.
 */
export async function getModelInfo() {
  const { data } = await apiClient.get("/model/info");
  return data;
}

export default apiClient;
