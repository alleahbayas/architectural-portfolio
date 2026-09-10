import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Projects.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import upload from "./cloudinary.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gillian-gutierrez.vercel.app",
  ],
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project by slug
app.get("/api/projects/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new project (protected)
app.post("/api/projects", requireAuth, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a project (protected)
app.put("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    console.log("=== Incoming PUT request ===");
    console.log("req.body.sections:", JSON.stringify(req.body.sections, null, 2));

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    console.log("=== Saved document ===");
    console.log("updated.sections:", JSON.stringify(updated.sections, null, 2));

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE a project (protected)
app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: req.file.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));