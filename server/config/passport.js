//const LocalStrategy = require("passport-local").Strategy;
import LocalStrategy from "passport-local";
import User from "../models/User.js";

LocalStrategy.Strategy;

export default function (passport) {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, { msg: `${email} not found` });
          }
          const match = await user.comparePassword(password);
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, { msg: "wrong password" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
}
