import { Router } from "express";
import upload from "../middleware/multer.js";
import {
  getProjects,
  getBookmarks,
  createProject,
  updateProject,
  bookmarkProject,
  deleteProject,
} from "../controllers/projects.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();

//Post Routes - simplified for now
router.get("/:id?", ensureAuth, getProjects);
router.get("/bookmarks/saved", ensureAuth, getBookmarks);

router.post("/createProject", createProject);

router.put("/editProject/:id", upload.single("file"), updateProject);
router.put("/bookmarkProject/:id", bookmarkProject);

router.delete("/deleteProject/:id", deleteProject);

export default router;
