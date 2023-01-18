import Comment from "../models/Comment.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

//I'll use user ids in params.id
export const getChartData = async (req, res) => {
  let user, task, project, comment, closedTasks, createdTask;
  try {
    user = await User.find().populate("assignedTasks").lean();
    task = await Task.find({ status: { $ne: "closed" } }).lean();
    closedTasks = await Task.find({ status: "closed" }).lean();
    project = await Project.find().populate("user tasks").lean();
    //comment = await Comment.find().lean();
    if (req.params.id) {
      user = await User.findById(req.params.id).lean();
      /* task = await Task.find({
          $or: [ 
            //{ createdBy: req.params.id }, 
            { assignedTo: req.params.id }
          ]}).lean();
        closedTasks = await Task.find({
          $and: [{
            $or: [
              //{ createdBy: req.params.id }, 
              { assignedTo: req.params.id }
            ]}, 
            {status: "closed"}
          ]}).lean(); */

      //separate tasks in createdBy and assignedTo
      task = await Task.find({ assignedTo: req.params.id }).lean();
      createdTask = await Task.find({ createdBy: req.params.id }).lean();

      closedTasks = await Task.find({
        $and: [
          {
            $or: [
              //{ createdBy: req.params.id },
              { assignedTo: req.params.id },
            ],
          },
          { status: "closed" },
        ],
      }).lean();
      project = await Project.find({ user: req.params.id }).lean();
      comment = await Comment.find({ createdBy: req.params.id }).lean();
    }
    res
      .status(200)
      .json({ user, task, project, comment, closedTasks, createdTask });
  } catch (err) {
    console.log(err);
  }
};

export const getChartsPage = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.render("charts", {
      page: "Analytics",
      showSearch: false,
      loggedUser: req.user,
      users,
    });
  } catch (err) {
    console.error(err);
  }
};
