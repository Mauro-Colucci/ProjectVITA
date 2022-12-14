const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

const Task = require('../models/Task')
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
    //no id brings MY tasks, with id brings a specific project tasks
    getOwnTask: async(req, res)=>{
        let singleTask = null
        let comments = null
        const id = ""
        try {
            const myActiveTasks = await Task.find({assignedTo: req.user.id, status: {$ne:'closed'}}).sort({createdAt: "desc"}).populate("createdBy assignedTo").lean();
            if(req.params.myTasksId){
                singleTask = await Task.findById(req.params.myTasksId).populate("projectId createdBy assignedTo").lean();
                comments = await Comment.find({taskId: req.params.myTasksId}).sort({createdAt: "desc"}).populate("createdBy").lean()
            }
            const allUsers = await User.find().lean()
            const reqUserIsAdmin = await User.findById(req.user.id)
            //res.json({singleTask, myActiveTasks, allUsers, userIsAdmin: reqUserIsAdmin.isAdmin, comments})
            res.render("taskPage", {task: myActiveTasks, allUsers, singleTask, page: "My Tasks", comments, showSearch: true, loggedUser: req.user, userIsAdmin: reqUserIsAdmin.isAdmin, id, myTask: true})

        } catch (err) {
            console.error(err)
        }
    },
    //projectTasks/:projectId brings ALL tasks from a singleProject
    //projectTasks/:projectId/:taskId brings a specific task for that project
    getProjectTask: async(req, res)=>{
        let singleTask = null
        let comments = null
        try {
            const projectAllTasks = await Task.find({projectId: req.params.projectId, status: {$ne:'closed'}}).populate("createdBy assignedTo").lean();
            if(req.params.taskId){
                singleTask = await Task.findById(req.params.taskId).populate("projectId createdBy assignedTo").lean();
                comments = await Comment.find({taskId: req.params.taskId}).sort({createdAt: "desc"}).populate("createdBy").lean()
            }
            const allUsers = await User.find().lean()
            const reqUserIsAdmin = await User.findById(req.user.id)
            //res.json({projectTask, projectAllTasks, allUsers, userIsAdmin: reqUserIsAdmin.isAdmin, comments})
            res.render("taskPage", {task: projectAllTasks, singleTask, allUsers, id: req.params.projectId, page: "Project Tasks", comments, showSearch: true, loggedUser: req.user, userIsAdmin: reqUserIsAdmin.isAdmin, myTask: false})
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
            createdBy: req.user.id,
            projectId
            });
            await Project.findByIdAndUpdate(projectId, {$push: { tasks: task.id }})
            console.log("task has been added!");
            res.redirect('back')
            //res.redirect(`/task/${projectId}`);
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