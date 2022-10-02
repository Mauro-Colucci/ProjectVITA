const router = require("express").Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const projectsController = require("../controllers/projects");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.get("/", ensureGuest, homeController.getIndex);

router.get("/dashboard", ensureAuth, projectsController.getFeed);

router.get("/login",ensureGuest, authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup",ensureGuest, authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/logout", authController.logout);

module.exports = router;