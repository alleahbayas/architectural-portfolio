import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: String,
  description: String,
}, { _id: false });

const metaSchema = new mongoose.Schema({
  projectType: String,
  designer: String,
  location: String,
}, { _id: false });

const briefSchema = new mongoose.Schema({
  intro: String,
  question: String,
  description: String,
}, { _id: false });

const approachSchema = new mongoose.Schema({
  description: String,
  features: [featureSchema],
  images: [String],
}, { _id: false });

const brandZoningSchema = new mongoose.Schema({
  description: String,
  images: [String],
}, { _id: false });

const sectionConfigSchema = new mongoose.Schema({
  num: String,
  label: String,
}, { _id: false });

const sectionsSchema = new mongoose.Schema({
  overview: sectionConfigSchema,
  features: sectionConfigSchema,
  brandZoning: sectionConfigSchema,
  construction: sectionConfigSchema,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  location: String,
  image: String,
  category: String,
  disclaimer: String,
  meta: metaSchema,
  brief: briefSchema,
  approach: approachSchema,
  brandZoning: brandZoningSchema,
  constructionImages: [String],
  constructionNote: String,
  sections: sectionsSchema,
  visible: { type: Boolean, default: true },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;