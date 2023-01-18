import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
//
import flash from "express-flash";
//
import logger from "morgan";
import cors from "cors";
import { config } from "dotenv";
import mainRoutes from "./routes/main.js";
import taskRoutes from "./routes/tasks.js";
import projectRoutes from "./routes/projects.js";
import profileRoutes from "./routes/profiles.js";
import commentRoutes from "./routes/comments.js";
import chartRoutes from "./routes/charts.js";
import connectDB from "./config/database.js";
import passportConfig from "./config/passport.js";

const PORT = process.env.PORT || 3000;
const app = express();

config({ path: "./config/.env" });
passportConfig(passport);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

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

//base api routes
app.use("/api", mainRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/chart", chartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});
