const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

//will be removed/changed
const Project = require("../models/Project");
const Task = require("../models/Task")
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProjects: async (req, res) => {
    let project
    let projectsPage = true
    let page = "My Projects"
      try {
          const projects = await Project.find({user: req.user.id}).lean();
          const allUsers = await User.find().lean()
          if(req.params.id){
            project = await Project.findById(req.params.id).populate('user').populate({path: 'tasks', populate : {
              path : 'createdBy assignedTo'
            }}).lean()
            projectsPage = false
            if(project.user._id != req.user.id) page = "Public Projects"
          }
          res.render("projects", { projects: projects, projectsPage, singleProject: project, page, loggedUser: req.user,allUsers, showSearch: true, myTask: false});
      } catch (err) {
          console.log(err);
      }
  },
  bookmarkProject: async(req, res) => {
    const userId = req.user.id
    try {
       const bookmarkedProject = await Project.findById(req.params.id);
       if (!bookmarkedProject.bookmarks.includes(userId)) {
         await bookmarkedProject.updateOne({ $push: { bookmarks: userId } });
       } else {
         await bookmarkedProject.updateOne({ $pull: { bookmarks: userId } });
       }
       res.redirect("back");
    } catch (err) {
      console.error(err)
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
      const projects = await Project
                                    .find({publish: {$ne: false}}) //find all documents with publish not equal to false
                                    //.sort({ createdAt: "asc" }) // sort it by createdAt in ascending order
                                    .populate('user') //populate the user key with the corresponding mongoose object
                                    .populate({path: 'tasks', match: {status : { $ne: 'closed'}}}) //populate the "tasks" path matching the status to be not equal to closed. ie: only bring the tasks that are not closed.
                                    .lean(); //bring a POJO, which is "leaner" ie: smaller in size.
      projects.sort((a,b)=> b.tasks.length - a.tasks.length) // sort projects by number of tasks in descending order      
      res.render("dashboard.ejs", { projects, loggedUser: req.user, page: "Dashboard", showSearch: true });
    } catch (err) {
      console.log(err);
    }
  },
  createProject: async (req, res) => {
    try {
      //const result = await cloudinary.uploader.upload(req.file.path);

      const project = await Project.create({
        projectName: req.body.projectName,
        //image: result.secure_url,
        //cloudinaryId: result.public_id,
        description: req.body.description,
        user: req.user.id,
      });
      await User.findByIdAndUpdate(req.user.id, {$push:{createdProjects: project._id}})
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
      await User.findByIdAndUpdate(project.user, {$pull:{createdProjects: project._id}})
      console.log("Deleted Project");
      res.redirect("back");
    } catch (err) {
      res.redirect("back");
    }
  },
};
