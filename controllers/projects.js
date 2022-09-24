const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

//will be removed/changed
const Project = require("../models/Project");
const User = require("../models/User");

module.exports = {
  getProjects: async (req, res) => {
    let project
      try {
          const projects = await Project.find({user: req.user.id});
          if(req.params.id){
            project = await Project.findById(req.params.id).populate('user tasks').lean()
            console.log(project)
          }
          res.render("projects", { projects: projects, singleProject: project, page: "My Projects", user: req.user, showSearch: true});
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
      await project.updateOne({
        image: result?.secure_url,
        cloudinaryId: result?.public_id,
        description: req.body.description,
        publish: req.body.publish? true: false,
        projectName: req.body.projectName
      });
      res.redirect(`/project/${project.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      //need to fetch info for the dashboard
      const projects = await Project.find().sort({ createdAt: "asc" }).populate('user').lean();
      res.render("dashboard.ejs", { projects: projects, user: req.user, page: "Dashboard", showSearch: true });
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
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  },
  //deleteProject
  deleteProject: async (req, res) => {
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
