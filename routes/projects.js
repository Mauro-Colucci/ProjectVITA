const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const projectsController = require("../controllers/projects");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id?", ensureAuth, projectsController.getProjects);


//router.post("/createProject", projectsController.createPost);

router.put('/test',upload.single("file"), projectsController.testPost)


//need to create an editPost controller for the project
//router.put("/editPost/:id", postsController.likePost);

//router.delete("/deletePost/:id", projectsController.deletePost);

module.exports = router;