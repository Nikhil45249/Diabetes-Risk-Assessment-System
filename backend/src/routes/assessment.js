const router = require("express").Router();
const { predictRisk } = require("../controllers/assessmentController");

router.post("/predict", predictRisk);

module.exports = router;
