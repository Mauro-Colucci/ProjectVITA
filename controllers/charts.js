const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");


module.exports = {
  //I'll use user ids in params.id
  getChartData: async (req, res) => {
    let user, task, project, comment
    try {
      user = await User.find();
      //while this sends the correct info: all tasks except the ones that are closed, I'm using user and project info to trace graphs, need to review this
      task = await Task.find({ status: {$ne: "closed"} });
      project = await Project.find();
      comment = await Comment.find();
      if (req.params.id){
        user = await User.findById(req.params.id).lean()
      }
      res.status(200).json({user, task, project, comment})
    } catch (err) {
      console.log(err);
    }
  }
}