const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const upload = require("../middleware/multer");


//Main Routes - simplified for now
router.get("/", ensureGuest, homeController.getIndex);

router.get("/profile/:id?", ensureAuth, postsController.getProfile);
router.put("/profile/:id", upload.single("file"), postsController.editProfile);

router.get("/dashboard", ensureAuth, postsController.getFeed);

router.get("/login",ensureGuest, authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup",ensureGuest, authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/logout", authController.logout);

module.exports = router;
