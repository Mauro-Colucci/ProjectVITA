const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
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
  sourceCode: {
    type: String
  },
  liveDemo: {
    type: String
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }]
}, {timestamps: true});

module.exports = mongoose.model("Project", ProjectSchema);