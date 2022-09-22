const router = require("express").Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const upload = require("../middleware/multer");
const profileController = require("../controllers/profiles");


router.get("/:id?", ensureAuth, profileController.getProfile);
router.put("/:id", upload.single("file"), profileController.editProfile);


module.exports = router;
