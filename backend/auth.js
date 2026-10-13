const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readData, writeData } = require("../utils/fileDb");

const router = express.Router();

// POST /api/register
router.post("/register", async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  // 1. validate the input
  if (name.length < 2) {
    return res.status(400).json({ message: "Please enter your name" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // 2. make sure the email isn't already used
  const users = readData("users");
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "This email is already registered" });
  }

  // 3. scramble the password and save the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    name: name,
    email: email,
    password: hashedPassword,
  };

  users.push(user);
  writeData("users", users);

  // 4. reply (never send the password back)
  res.status(201).json({
    message: "Account created",
    user: { id: user.id, name: user.name, email: user.email },
  });
});
// POST /api/login
router.post("/login", async (req, res) => {
  const body = req.body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // find the user
  const users = readData("users");
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // check the password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // create the token (the "wristband")
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token: token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});


module.exports = router;