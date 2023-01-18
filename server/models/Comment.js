import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    edited: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true },
  {
    toObject: { virtuals: true },
  }
);
CommentSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "comment",
  autopopulate: true,
});

CommentSchema.plugin(mongooseAutoPopulate);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
