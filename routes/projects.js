const router = require("express").Router();
const upload = require("../middleware/multer");
const projectsController = require("../controllers/projects");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id?", ensureAuth, projectsController.getProjects);

router.post("/createProject", projectsController.createProject);

//router.put('/test',upload.single("file"), projectsController.testPost)

//router.delete("/deletePost/:id", projectsController.deletePost);

module.exports = router;