const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");


module.exports = {
  //I'll use user ids in params.id
  getChartData: async (req, res) => {
    let user, task, project, comment, closedTasks
    try {
      user = await User.find().populate('assignedTasks').lean();
      task = await Task.find({ status: {$ne: "closed"} }).lean();
      closedTasks = await Task.find({ status: "closed"}).lean();
      project = await Project.find().populate("user tasks").lean();
      comment = await Comment.find().lean();
      if (req.params.id){

        //separate tasks in createdBy and assignedTo?
        user = await User.findById(req.params.id).lean();
        task = await Task.find({
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
          ]}).lean();
        project = await Project.find({user: req.params.id}).lean(); 
        comment = await Comment.find({createdBy: req.params.id}).lean();
      }
      res.status(200).json({user, task, project, /* comment, */ closedTasks})
    } catch (err) {
      console.log(err);
    }
  },
  getChartsPage: async (req, res) => {
    try {
      const users = await User.find().lean()
      res.render("charts", {page: "Analytics", showSearch: false, loggedUser: req.user, users })
    } catch (err) {
      console.error(err)
    }
  }
}