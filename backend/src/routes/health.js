const router = require("express").Router();
const mlService = require("../services/mlService");

router.get("/", async (_req, res) => {
  try {
    const mlHealth = await mlService.checkHealth();
    res.json({
      success: true,
      backend: { status: "healthy" },
      mlService: mlHealth,
    });
  } catch {
    res.json({
      success: true,
      backend: { status: "healthy" },
      mlService: { status: "unavailable", model_loaded: false },
    });
  }
});

module.exports = router;
