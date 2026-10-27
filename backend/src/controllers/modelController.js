/**
 * Model info controller — proxies metadata from the ML service.
 */

const mlService = require("../services/mlService");

async function getInfo(req, res, next) {
  try {
    const data = await mlService.getModelInfo();
    return res.json(data);
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({
        success: false,
        error: {
          message: "ML service is unavailable. Cannot retrieve model info.",
          statusCode: 503,
        },
      });
    }
    next(err);
  }
}

module.exports = { getInfo };
