const Comment = require("../models/Comment");
const Project = require("../models/Project");

module.exports = {
  createComment: async (req, res) => {
    try {
      const project = await Project.findOne({ tasks: req.params.id }).lean();
      await Comment.create({
        comment: req.body.comment,
        taskId: req.params.id,
        createdBy: req.user.id,
        projectId: project._id,
      });
      console.log("Comment has been added!");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    const userId = req.user.id;
    try {
      //finds the comment by the ID provided in :id (params)
      const commentDoc = await Comment.findById(req.params.id);
      //if that Id is NOT in the likes array, add the user id to it
      if (!commentDoc.likes.includes(userId)) {
        await commentDoc.updateOne({ $push: { likes: userId } });
        //if it is, then remove it. This way you can only like a post ONCE, the second time it'll remove your like.
      } else {
        await commentDoc.updateOne({ $pull: { likes: userId } });
      }
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  editComment: async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.id, {
        comment: req.body.editComment,
        edited: true,
      });
      res.redirect("back");
    } catch (err) {
      console.error(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      console.log("Deleted Comment");
      res.redirect("back");
    } catch (err) {
      console.error(err);
    }
  },
};
