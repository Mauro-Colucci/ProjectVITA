const router = require("express").Router();
const upload = require("../middleware/multer");
const tasksController = require("../controllers/tasks");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// router.get("/:id?", ensureAuth, tasksController.getTasks);
// router.get("/singleTask/:id", ensureAuth, tasksController.getSingleTask);

router.get("/:myTasksId?", ensureAuth, tasksController.getOwnTask);
router.get("/projectTask/:projectId/:taskId?", ensureAuth, tasksController.getProjectTask);


router.post("/createTask", tasksController.creatTask);

router.put('/updateTask/:id', tasksController.updateTask)

router.delete("/deleteTask/:id", tasksController.deleteTask);

module.exports = router;