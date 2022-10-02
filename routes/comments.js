const router = require("express").Router();
const commentsController = require("../controllers/comments");


router.post("/createComment/:id", commentsController.createComment);

router.put("/likeComment/:id", commentsController.likeComment);

router.put("/editComment/:id", commentsController.editComment);

router.delete("/deleteComment/:id", commentsController.deleteComment)


module.exports = router;