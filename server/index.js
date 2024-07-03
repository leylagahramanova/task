require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./middleware/auth");
const tasksRoutes = require("./routes/tasks");
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks",tasksRoutes);

const port = process.env.PORT || 8082;
app.listen(port, console.log(`Listening on port ${port}...`));