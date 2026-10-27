/**
 * Assessment controller — validates input and delegates to the ML service.
 */

const { validateAssessmentInput } = require("../validators/assessmentValidator");
const mlService = require("../services/mlService");

async function predictRisk(req, res, next) {
  try {
    // 1. Validate
    const errors = validateAssessmentInput(req.body);
    if (errors.length > 0) {
      console.warn("⚠️ Assessment validation rejected:", errors);
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation failed: ${errors.join("; ")}`,
          details: errors,
        },
      });
    }

    // 2. Forward to ML service (the Python service calculates BMI)
    const mlResponse = await mlService.getPrediction(req.body);

    // 3. Return consistent envelope
    return res.json(mlResponse);
  } catch (err) {
    // ML service unreachable or errored
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({
        success: false,
        error: {
          message:
            "ML prediction service is unavailable. Please try again later.",
          statusCode: 503,
        },
      });
    }

    if (err.response) {
      // Forward ML service error status cleanly as a string
      let errorMessage = "ML service returned an error.";
      const detail = err.response.data?.detail;
      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((d) => (d.msg ? `${d.loc ? d.loc.slice(1).join(".") + ": " : ""}${d.msg}` : JSON.stringify(d)))
          .join("; ");
      } else if (detail && typeof detail === "object") {
        errorMessage = JSON.stringify(detail);
      }

      console.warn("⚠️ ML service error status", err.response.status, errorMessage);
      return res.status(err.response.status).json({
        success: false,
        error: {
          message: errorMessage,
          statusCode: err.response.status,
        },
      });
    }

    next(err);
  }
}

module.exports = { predictRisk };
