const router = require("express").Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const chartController = require("../controllers/charts");
const homeController = require("../controllers/home");


router.get("/home", ensureAuth, chartController.getChartsPage);

router.get("/:id?", ensureAuth, chartController.getChartData);


module.exports = router;
