import { Router } from "express";
import {
  createComment,
  likeComment,
  editComment,
  deleteComment,
} from "../controllers/comments.js";

const router = Router();

router.post("/createComment/:taskId/:commentId?", createComment);

router.put("/likeComment/:id", likeComment);

router.put("/editComment/:id", editComment);

router.delete("/deleteComment/:id", deleteComment);

export default router;
