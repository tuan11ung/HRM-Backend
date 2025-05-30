const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');

// Load environment variables
dotenv.config();

// Connect to database
const db = require("./models");

db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and Resync Database with { force: true }");
    // Init Database
    // initial();
});

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],  // Allow requests from these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'access_token', 'Authorization'],  // Allow these headers
}));
app.use(morgan("common"));

app.get("/", (req, res) => {
    res.json({ message: "HR ATTENDANCE" });
  });
  
// routes
require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/position.route")(app);
require("./routes/level.route")(app);
require("./routes/vacation.route")(app);
require("./routes/upload.route")(app);
require("./routes/event.route")(app);
require("./routes/attendance.route")(app);
require("./routes/notification.route")(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});