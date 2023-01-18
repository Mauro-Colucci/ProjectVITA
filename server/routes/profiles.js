import { Router } from "express";
import { ensureAuth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { getProfile, editProfile } from "../controllers/profiles.js";

const router = Router();

router.get("/:id?", ensureAuth, getProfile);
router.put("/:id", upload.single("file"), editProfile);

export default router;
