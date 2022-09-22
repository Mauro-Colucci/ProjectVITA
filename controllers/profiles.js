const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const User = require("../models/User");
bcrypt = require('bcrypt')


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
  }
}