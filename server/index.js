import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Projects.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import upload, { uploadResume } from "./cloudinary.js";
import Settings from "./models/Settings.js";

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
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
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

// GET site settings (public)
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE site settings (protected)
app.put("/api/settings", requireAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPLOAD resume file (protected)
app.post("/api/upload-resume", requireAuth, uploadResume.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: req.file.path, fileName: req.file.originalname });
});

// DOWNLOAD resume with correct filename (public, proxies Cloudinary file)
app.get("/api/download-resume", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings?.resumeUrl) {
      return res.status(404).json({ error: "No resume found" });
    }

    const response = await fetch(settings.resumeUrl);
    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch resume from storage" });
    }

    const buffer = await response.arrayBuffer();
    const fileName = settings.resumeFileName || "resume.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VIEW resume inline in browser (public, no forced download)
app.get("/api/view-resume", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings?.resumeUrl) {
      return res.status(404).json({ error: "No resume found" });
    }

    const response = await fetch(settings.resumeUrl);
    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch resume from storage" });
    }

    const buffer = await response.arrayBuffer();
    const fileName = settings.resumeFileName || "resume.pdf";

    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE resume (protected)
app.delete("/api/resume", requireAuth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return res.status(404).json({ error: "Settings not found" });

    settings.resumeUrl = "";
    settings.resumeFileName = "";
    await settings.save();

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));