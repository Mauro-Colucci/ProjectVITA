const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //if true, we can publish our project to be shown in a "comunal" post, so that other users can post issues/comments
  publish: {
    type: Boolean,
    default: false
  },
  issue: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue"
  }]
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);
