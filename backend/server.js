const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/blogs", blogRoutes);

// test routes
app.get("/", (req, res) => {
  res.send("Wanderly API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is working" });
});

// start the server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
