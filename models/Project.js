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
  bookmarks: {
    type: Array,
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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