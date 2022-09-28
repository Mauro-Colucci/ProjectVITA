const router = require("express").Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const chartController = require("../controllers/charts");


router.get("/:id?", ensureAuth, chartController.getChartData);


module.exports = router;
