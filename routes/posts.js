const express = require("express");
const router = express.Router();
//const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

//quick project creation, just title and desc
//need to ponder if needed or just go for a full/complete form
//right now in a modal, need to think if a page would be better
router.post("/createPost", postsController.createPost);

//need to create an editPost controller for the project
//router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
