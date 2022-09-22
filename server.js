const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const PORT = process.env.PORT || 3000
const mainRoutes = require("./routes/main");
const taskRoutes = require("./routes/tasks");
const projectRoutes = require("./routes/projects")
const profileRoutes = require("./routes/profiles")

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

//Use flash messages for errors, info, ect...
app.use(flash());

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/profile", profileRoutes);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);

//Server Running
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
