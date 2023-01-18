import Comment from "../models/Comment.js";
import Project from "../models/Project.js";

export const createComment = async (req, res) => {
  try {
    const project = await Project.findOne({ tasks: req.params.taskId }).lean();
    await Comment.create({
      text: req.body.text,
      //taskId: req.params.commentId ? undefined : req.params.taskId,
      taskId: req.params.taskId,
      createdBy: req.user.id,
      projectId: project._id,
      comment: req.params.commentId,
    });
    console.log("Comment has been added!");
    res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

export const likeComment = async (req, res) => {
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
};

export const editComment = async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, {
      text: req.body.editComment,
      edited: true,
    });
    res.redirect("back");
  } catch (err) {
    console.error(err);
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    console.log("Deleted Comment");
    res.redirect("back");
  } catch (err) {
    console.error(err);
  }
};
