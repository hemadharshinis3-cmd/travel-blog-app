const express = require("express");
const requireAuth = require("../middleware/auth");
const { readData, writeData } = require("../utils/fileDb");

const router = express.Router();

// GET /api/blogs  (everyone, newest first)
router.get("/", (req, res) => {
  const blogs = readData("blogs");
  res.json(blogs.slice().reverse());
});

// GET /api/blogs/mine  (logged-in user's own stories)
router.get("/mine", requireAuth, (req, res) => {
  const blogs = readData("blogs");
  const mine = blogs.filter((b) => b.authorId === req.user.id);
  res.json(mine.reverse());
});

// POST /api/blogs  (create a story, login required)
router.post("/", requireAuth, (req, res) => {
  const body = req.body || {};
  const title = String(body.title || "").trim();
  const category = String(body.category || "").trim();
  const image = String(body.image || "").trim();
  const content = String(body.content || "").trim();

  if (title.length < 5) {
    return res.status(400).json({ message: "Title must be at least 5 characters" });
  }
  if (!category) {
    return res.status(400).json({ message: "Please choose a category" });
  }
  if (image) {
    try {
      new URL(image);
    } catch {
      return res.status(400).json({ message: "Enter a valid image web address" });
    }
  }
  if (content.length < 50) {
    return res.status(400).json({ message: "Your story needs at least 50 characters" });
  }

  const blogs = readData("blogs");
  const blog = {
    id: Date.now(),
    title: title,
    category: category,
    image: image,
    content: content,
    author: req.user.name,
    authorId: req.user.id,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };

  blogs.push(blog);
  writeData("blogs", blogs);

  res.status(201).json({ message: "Story published", blog: blog });
});

// DELETE /api/blogs/:id  (only the author can delete)
router.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const blogs = readData("blogs");
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (blog.authorId !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own stories" });
  }

  writeData("blogs", blogs.filter((b) => b.id !== id));
  res.json({ message: "Story deleted" });
});

module.exports = router;