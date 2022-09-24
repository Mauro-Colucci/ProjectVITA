const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

const Task = require('../models/Task')
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
   /*  getMyTasks: async (req, res) => {
        try {
            const tasks = await Task.find({assignedTo: req.user.id}).lean();
            res.render("tasks", { tasks: tasks, page: "My Tasks", user: req.user, showSearch: true});
        } catch (err) {
            console.log(err);
        }
    }, */
    getTasks: async (req, res) =>{
        let task
        let ProjectId = ""
        let page = "My Tasks"
        try {
            //the id in params is for the project
            if (req.params.id){
                ProjectId = req.params.id
                task = await Task.find({projectId: ProjectId}).populate("createdBy assignedTo").lean();
                page = "Project Tasks"
            } else {
                task = await Task.find({assignedTo: req.user.id}).lean();
            }



            const allUsers = await User.find().lean()
            res.render("singleTask", { task, page, user: req.user, showSearch: true, id: ProjectId, allUsers})
        } catch (err) {
            console.error(err)
        }
    },
    getSingleTask: async(req, res)=>{
        try {
            //need to refactor this, I don't like having three separate get controllers.
            const task = await Task.findById(req.params.id).populate("createdBy assignedTo").lean();
            const tasks = await Task.find({projectId: task.projectId}).populate("createdBy assignedTo").lean();
            const comments = await Comment.find({taskId: req.params.id}).sort({createdAt: "desc"}).lean()
            const allUsers = await User.find().lean()
            res.render("singleTask", { singleTask: task,  task: tasks, page: "Project Tasks", user: req.user, showSearch: true, id: task.projectId, comments, allUsers})
        } catch (err) {
            console.error(err)
        }
    },
    creatTask: async (req, res) => {
        try {
            //const result = await cloudinary.uploader.upload(req.file.path);
            //need to add a dropdown with all users in the modal to add them to assignedTo
            const projectId = req.body.project
            const task = await Task.create({
            taskName: req.body.taskName,
            //image: result.secure_url,
            //cloudinaryId: result.public_id,
            description: req.body.description,
            tag: req.body.tag,
            priority: req.body.priority,
            //status: req.body.status,
            createdBy: req.user.id,
            projectId
            });
            await Project.findByIdAndUpdate(projectId, {$push: { tasks: task.id }})
            console.log("task has been added!");
            res.redirect(`/task/${projectId}`);
        } catch (err) {
            console.log(err);
        }
    },
    updateTask: async(req, res) =>{
        try {
          const task = await Task.findByIdAndUpdate(req.params.id,{
            taskName: req.body.taskName,
            description: req.body.description,
            tag: req.body.tag,
            priority: req.body.priority,
            status: req.body.status,
            assignedTo: req.body.assignedTo
          }, {
            new: true
          });
          //need to $pull the task id from the previously assigned user. find on user with task id as argument and if match do a $pull should work
          //task.assignedTo && await User.findByIdAndUpdate(task.assignedTo, { $push: { assignedTasks: task._id } })
          res.redirect(`/task/${task.projectId}`)
        } catch (err) {
          console.log(err);
        }
      },
    deleteTask: async (req, res) => {
        try {
            // Find Project by id
            let project = await Project.findById({ _id: req.params.id });
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(project.cloudinaryId);
            // Delete Project from db
            await Project.remove({ _id: req.params.id });
            console.log("Deleted Project");
            res.redirect("/profile");
        } catch (err) {
            res.redirect("/profile");
        }
    },
};
