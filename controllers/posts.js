const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
bcrypt = require('bcrypt')

//will be removed/changed
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    let user
    try {
      user = await User.findById(req.user.id );
      const users = await User.find().lean()
      res.render("profile.ejs", { user: user, selection: users, page: "Profile", showSearch: false});
    } catch (err) {
      console.log(err);
    }
  },
  editProfile: async (req, res) =>{

    let updateQuery = {}

    const validationErrors = [];

    try {

      if (req.body.newPassword || req.body.confirmNewPassword){
        if (!validator.isLength(req.body.newPassword, { min: 8 }))
        validationErrors.push({
          msg: "Password must be at least 8 characters long",
        });
        if (req.body.newPassword !== req.body.confirmNewPassword)
          validationErrors.push({ msg: "Passwords do not match" });
      
        if (validationErrors.length) {
          req.flash("errors", validationErrors);
          return res.redirect("/profile");
        }
        updateQuery.password = await bcrypt.hash(req.body.newPassword, 10)
      }

      const user = await User.findById(req.params.id)      
      //need to perform a check IF THERE's A FILE, perform the cloudinary destroy/upload, else: keep the old
      if(req.file){
        //IF there's a cloudinary id stored THEN destroy it, if I don't perform this check it'll crash if the user doesn't have anything in that field
        user.cloudinaryId && await cloudinary.uploader.destroy(user.cloudinaryId);
        const result = await cloudinary.uploader.upload(req.file.path);
        updateQuery.avatar = result.secure_url
        updateQuery.cloudinaryId = result.public_id
      } else {
        updateQuery.avatar = user.avatar
        updateQuery.cloudinaryId = user.cloudinaryId
      }

      await user.updateOne(updateQuery);
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  //getDashboard
  getFeed: async (req, res) => {
    try {
      //need to fetch info for the dashboard
      const posts = await Post.find({publish: true}).sort({ createdAt: "asc" }).populate('user').lean();
      res.render("dashboard.ejs", { projects: posts, user: req.user, page: "Dashboard",rowsShown:true, showSearch: true });
    } catch (err) {
      console.log(err);
    }
  },
  //getProject
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  //createProject
  createPost: async (req, res) => {
    try {
      //const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        projectName: req.body.projectName,
        //image: result.secure_url,
        //cloudinaryId: result.public_id,
        description: req.body.description,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  },
  //deleteProject
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
