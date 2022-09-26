const router = require("express").Router();
const upload = require("../middleware/multer");
const projectsController = require("../controllers/projects");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id?", ensureAuth, projectsController.getProjects);

router.post("/createProject", projectsController.createProject);

router.put('/editProject/:id',upload.single("file"), projectsController.updateProject)

router.delete("/deleteProject/:id", projectsController.deleteProject);

module.exports = router;