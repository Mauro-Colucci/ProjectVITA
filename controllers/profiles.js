const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const User = require("../models/User");
bcrypt = require('bcrypt')


module.exports = {
  getProfile: async (req, res) => {
    let user
    try {
      if (req.params.id){
        user = await User.findById(req.params.id).lean()
      } else {
        user = await User.findById(req.user.id).lean();
      }
      //sending req.user.id, since I named my variable user and that's the same name passport uses, so I was having issues comparing logged user to req.params.id
      res.render("profile.ejs", { user, page: "Profile", showSearch: false, loggedUser: req.user.id});
    } catch (err) {
      console.log(err);
    }
  },
  editProfile: async (req, res) =>{

    let newPassword
    let result
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
        newPassword = await bcrypt.hash(req.body.newPassword, 10)
      }

      const user = await User.findById(req.params.id)      
      //need to perform a check IF THERE's A FILE, perform the cloudinary destroy/upload, else: keep the old
      if(req.file){
        //IF there's a cloudinary id stored THEN destroy it, if I don't perform this check it'll crash if the user doesn't have anything in that field
        user.cloudinaryId && await cloudinary.uploader.destroy(user.cloudinaryId);
        result = await cloudinary.uploader.upload(req.file.path);
      } 

      await user.updateOne({
        avatar: result?.secure_url,
        cloudinaryId: result?.public_id,
        password: newPassword,
        personalDetails: {
          company: req.body.company,
          possition: req.body.possition,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          country: req.body.country,
          aboutMe: req.body.aboutMe
        },
        socials: {
          github: req.body.github,
          twitter: req.body.twitter,
          linkedIn: req.body.linkedIn,
          twitch: req.body.twitch
        }
      });
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  }
}