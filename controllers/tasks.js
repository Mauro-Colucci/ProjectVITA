const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

const Task = require('../models/Task')
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
    getTasks: async (req, res) =>{
        let task
        let ProjectId = ""
        let page = "My Tasks"
        try {
            //the id in params is for the project
            if (req.params.id){
                ProjectId = req.params.id
                task = await Task.find({projectId: ProjectId}).sort({createdAt: "desc"}).populate("createdBy assignedTo").lean();
                page = "Project Tasks"
            } else {
                //$ne = not equal to
                task = await Task.find({assignedTo: req.user.id, status: {$ne:'closed'}}).populate("createdBy assignedTo").lean();
            }
            const allUsers = await User.find().lean()
            const userIsAdmin = await User.findById(req.user.id)
            res.render("singleTask", { task, page, user: req.user,userIsAdmin: userIsAdmin.isAdmin , showSearch: true, id: ProjectId, allUsers})
        } catch (err) {
            console.error(err)
        }
    },
    getSingleTask: async(req, res)=>{
        try {
            const task = await Task.findById(req.params.id).populate("createdBy assignedTo").lean();
            const tasks = await Task.find({projectId: task.projectId}).populate("createdBy assignedTo").lean();
            const comments = await Comment.find({taskId: req.params.id}).sort({createdAt: "desc"}).populate("createdBy").lean()
            const allUsers = await User.find().lean()
            const userIsAdmin = await User.findById(req.user.id)
            res.render("singleTask", { singleTask: task, userIsAdmin: userIsAdmin.isAdmin ,  task: tasks, page: "Project Tasks", user: req.user, showSearch: true, id: task.projectId, comments, allUsers})
        } catch (err) {
            console.error(err)
        }
    },
    creatTask: async (req, res) => {
        try {
            //const result = await cloudinary.uploader.upload(req.file.path);
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
          await User.findOneAndUpdate({assignedTasks: task._id}, {$pull: {assignedTasks: task._id}})
          await User.findByIdAndUpdate(req.body.assignedTo,{
            $addToSet:{assignedTasks: task._id}
          })
          //redirects to the page the request originated from
          res.redirect("back")
        } catch (err) {
          console.log(err);
        }
      },
    deleteTask: async (req, res) => {
        const id = req.params.id
        try {
            // Find Project by id
            let task = await Task.findByIdAndDelete(id);
            // Delete image from cloudinary
            //await cloudinary.uploader.destroy(task.cloudinaryId);;
            //delete all comments related to the task id
            await Comment.deleteMany({taskId: id})
            await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: id } })
            await User.findOneAndUpdate({assignedTasks: id}, {$pull: {assignedTasks: id}})

            //check the requested header referer (url) and if selects redirect according to the base url.
            const redirect = req.headers.referer.split('/').includes('singleTask' && id)? `/task/${task.projectId}` : "back"
            console.log("Deleted Project");
            res.redirect(redirect);
        } catch (err) {
            res.redirect("/");
        }
    },
};
