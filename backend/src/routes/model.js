const router = require("express").Router();
const { getInfo } = require("../controllers/modelController");

router.get("/info", getInfo);

module.exports = router;
