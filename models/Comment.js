const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: []
  },
  edited: {
    type: Boolean,
    default: false
  },
  projectId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

module.exports = mongoose.model("Comment", CommentSchema);