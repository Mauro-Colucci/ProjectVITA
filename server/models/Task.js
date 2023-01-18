import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tag: {
      type: String,
      enum: ["bug", "new feature", "todo", "misc"],
    },
    priority: {
      type: String,
      enum: ["high", "moderate", "low"],
    },
    status: {
      type: String,
      enum: ["new", "closed", "in progress"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
