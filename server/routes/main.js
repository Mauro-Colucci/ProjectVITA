import { Router } from "express";
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout,
} from "../controllers/auth.js";
import { getIndex } from "../controllers/home.js";
import { getFeed } from "../controllers/projects.js";
import { ensureAuth, ensureGuest } from "../middleware/auth.js";

const router = Router();

router.get("/", ensureGuest, getIndex);

router.get("/dashboard", ensureAuth, getFeed);

//router.get("/login", ensureGuest, getLogin);
router.post("/login", postLogin);

//router.get("/signup", ensureGuest, getSignup);
router.post("/signup", postSignup);

router.get("/logout", logout);

export default router;
