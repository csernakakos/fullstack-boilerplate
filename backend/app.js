const path = require("path");
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const dotenv = require("dotenv");
const {connectDB} = require("./config/db")
const {errorHandler} = require("./config/errorHandler");

const viewRouter = require("./routes/viewRoutes"); 
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");

const PORT = process.env.PORT || 3000;
dotenv.config({path: "./.env"});

// Connect to database
connectDB();

// Initialize apps and middleware
const app = express();
// Cookies:
app.use(cookieSession({name: "session", keys: [process.env.COOKIESECRET], maxAge: 24 * 60 * 60 * 1000}));
// View engine:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// URL-encoding:
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: true, limit: "10kb"}));
// Pubic folder:
app.use(express.static(path.join(__dirname, "../frontend/public")));
// CORS:
app.use(cors());
// Before deployment:
app.use(compression());
app.use(helmet());

// ROUTES
// Routes to website
// app.use("/", viewRouterOLD);
app.use("/", viewRouter);
// Routes to API
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

// Error handling middleware:
app.use(errorHandler);

app.listen(PORT, () => {console.log(`clubhouse on ${PORT}.`.black.bgCyan)});
