import { Router } from "express";
import {
  getOwnTask,
  getProjectTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();
// router.get("/:id?", ensureAuth, tasksController.getTasks);
// router.get("/singleTask/:id", ensureAuth, tasksController.getSingleTask);

router.get("/:myTasksId?", ensureAuth, getOwnTask);
router.get("/projectTask/:projectId/:taskId?", ensureAuth, getProjectTask);

router.post("/createTask", createTask);

router.put("/updateTask/:id", updateTask);

router.delete("/deleteTask/:id", deleteTask);

export default router;
