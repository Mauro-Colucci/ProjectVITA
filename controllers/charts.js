const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");


module.exports = {
  //I'll use user ids in params.id
  getChartData: async (req, res) => {
    let user, task, project, comment
    try {
      user = await User.find().populate('assignedTasks').lean();
      task = await Task.find({ status: {$ne: "closed"} }).lean();
      project = await Project.find().populate("user tasks").lean();
      comment = await Comment.find().lean();
      if (req.params.id){
        user = await User.findById(req.params.id).lean();
        project = await Project.find({user: req.params.id}).lean(); 
        comment = await Comment.find({createdBy: req.params.id}).lean();
      }
      res.status(200).json({user, task, project, comment})
    } catch (err) {
      console.log(err);
    }
  }
}