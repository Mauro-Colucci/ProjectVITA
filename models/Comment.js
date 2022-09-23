const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    //we could set the type to an array of objectId with ref to user, we could then populate in the API and show who liked the post?
    type: [String],
    default: []
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