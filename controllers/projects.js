const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

//will be removed/changed
const Project = require("../models/Project");
const Task = require("../models/Task")
const Comment = require("../models/Comment")

module.exports = {
  getProjects: async (req, res) => {
    let project
    let projectsPage = true
    let page = "My Projects"
      try {
          const projects = await Project.find({user: req.user.id}).lean();
          if(req.params.id){
            project = await Project.findById(req.params.id).populate('user tasks').lean()
            projectsPage = false
            if(project.user._id != req.user.id) page = "Public Projects"
          }
          res.render("projects", { projects: projects, projectsPage, singleProject: project, page, user: req.user, showSearch: true});
      } catch (err) {
          console.log(err);
      }
  },
  updateProject: async(req, res) =>{
    let result

    try {
      const project = await Project.findById(req.params.id)      

      if(req.file){
        project.cloudinaryId && await cloudinary.uploader.destroy(project.cloudinaryId);
        result = await cloudinary.uploader.upload(req.file.path);
      }
      console.log(req.body)
      await project.updateOne({
        image: result?.secure_url,
        cloudinaryId: result?.public_id,
        description: req.body.description,
        publish: req.body.publish? true: false,
        projectName: req.body.projectName,
        liveDemo: req.body.liveDemo,
        sourceCode: req.body.sourceCode
      });
      res.redirect(`/project/${project.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      //need to fetch info for the dashboard
      const projects = await Project.find({publish: {$ne: false}}).sort({ createdAt: "asc" }).populate('user').lean();
      //investigate if I need to add a new field to store the length of the tasks array like:
      //findByIdAndUpdate(id, {"$push": { "answers": answerId }, "$inc": { "answerLength": 1 } })
      res.render("dashboard.ejs", { projects, user: req.user, page: "Dashboard", showSearch: true });
    } catch (err) {
      console.log(err);
    }
  },
  createProject: async (req, res) => {
    try {
      //const result = await cloudinary.uploader.upload(req.file.path);

      await Project.create({
        projectName: req.body.projectName,
        //image: result.secure_url,
        //cloudinaryId: result.public_id,
        description: req.body.description,
        user: req.user.id,
      });
      console.log("Project has been added!");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  //deleteProject
  deleteProject: async (req, res) => {
    const id = req.params.id
    try {
      // Find Project by id
      let project = await Project.findById(id);
      // Delete image from cloudinary
      project.cloudinaryId && await cloudinary.uploader.destroy(project.cloudinaryId);
      // Delete Project from db
      await Project.deleteOne({ _id: id });
      await Task.deleteMany({ projectId: id })
      await Comment.deleteMany({ projectId: id })
      console.log("Deleted Project");
      res.redirect("back");
    } catch (err) {
      res.redirect("back");
    }
  },
};
