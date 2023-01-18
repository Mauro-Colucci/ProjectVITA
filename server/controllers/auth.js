import passport from "passport";
import validator from "validator";
import User from "../models/User.js";

//not used
export const getLogin = (req, res) => {
  res.render("login", {
    title: "Login",
  });
};

export const postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.json({ messages: req.flash() });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("errors", info);
      return res.json({ messages: req.flash() });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", { msg: "Success! You are logged in." });
      const { password, ...others } = user._doc;
      res.json({ user: others, messages: req.flash() });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) console.log("Error: Failed to log out.", err);
    //test
    req.user = null;
    res.redirect("/login");
  });
};

//not used
export const getSignup = (req, res) => {
  res.render("signup", {
    title: "Create Account",
  });
};

export const postSignup = (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;
  const validationErrors = [];
  if (!validator.isEmail(email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (password !== confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.json({ messages: req.flash() });
  }
  email = validator.normalizeEmail(email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName,
    email,
    password,
  });

  User.findOne({ $or: [{ email }, { userName }] }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.json({ messages: req.flash() });
    }
    user.save((err) => {
      if (err) return next(err);
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.json({ user, messages: req.flash() });
      });
    });
  });
};
