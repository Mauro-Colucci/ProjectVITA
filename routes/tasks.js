const router = require("express").Router();
const upload = require("../middleware/multer");
const tasksController = require("../controllers/tasks");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id?", ensureAuth, tasksController.getTasks);
router.get("/singleTask/:id", ensureAuth, tasksController.getSingleTask);



router.post("/createTask", tasksController.creatTask);

router.put('/updateTask/:id', tasksController.updateTask)

//router.delete("/deletePost/:id", tasksController.deletePost);

module.exports = router;