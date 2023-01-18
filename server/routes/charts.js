import { Router } from "express";
import { ensureAuth } from "../middleware/auth.js";
import { getChartsPage, getChartData } from "../controllers/charts.js";

const router = Router();

router.get("/home", ensureAuth, getChartsPage);

router.get("/:id?", ensureAuth, getChartData);

export default router;
