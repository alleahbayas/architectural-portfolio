import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  resumeUrl: { type: String, default: "" },
  resumeFileName: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;