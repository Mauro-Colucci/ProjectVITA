const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

const Task = require('../models/Task')
const Project = require("../models/Project");
const User = require("../models/User");

module.exports = {
    getTasks: async (req, res) => {
        try {
            const tasks = await Task.find({assignedTo: req.user.id});
            res.render("tasks", { tasks: tasks, page: "My Tasks", user: req.user, showSearch: true});
        } catch (err) {
            console.log(err);
        }
    },
    getTask: async (req, res) =>{
        try {
            //the id in params is for the project
            const ProjectId = req.params.id
            const task = await Task.find({projectId: ProjectId}).populate("createdBy").lean();
            
            res.render("singleTask", { task: task, page: "Project Tasks", user: req.user, showSearch: true, id: ProjectId})
        } catch (err) {
            console.error(err)
        }
    },
    creatTask: async (req, res) => {
        try {
            //const result = await cloudinary.uploader.upload(req.file.path);
            //need to add a dropdown with all users in the modal to add them to assignedTo
            const projectId = req.body.project
            console.log(req.body.project, req.user.id,)
            const task = await Task.create({
            taskName: req.body.taskName,
            //image: result.secure_url,
            //cloudinaryId: result.public_id,
            description: req.body.description,
            tag: req.body.tag,
            priority: req.body.priority,
            status: req.body.status,
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
