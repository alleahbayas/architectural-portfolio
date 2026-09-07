import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Projects.js";

dotenv.config();

const projects = [
  {
    slug: "sm-beauty",
    title: "SM Beauty -",
    subtitle: "The SM Store",
    location: "Zamboanga City",
    image: "/assets/cover.png",
    category: "RETAIL STORE DESIGN",
    disclaimer: "This project was completed during my tenure at Watsons Philippines. Displayed solely for portfolio purposes. All intellectual property and trademarks belong to their respective owners.",
    meta: {
      projectType: "Retail Interior Design & Fixture Development",
      designer: "Designer-in-Charge / Design Coordinator",
      location: "Zamboanga City, Philippines",
    },
    brief: {
      intro: "A RETAIL FIT-OUT FOCUSED ON ONE QUESTION:",
      question: "how does a beauty counter feel modern, clean, and unmistakably brand-friendly — without losing the shopper in the noise of a department store floor?",
      description: "Located at SM City Zamboanga, the project centers on the store layout and overall spatial design for the beauty department, balancing efficient circulation with clear product zoning that keeps every brand legible from the aisle.\n\nScope extended into the creation and detailing of new fixtures purpose-built to display a wide range of beauty products — engineered as much for merchandising flexibility as for the customer experience standing in front of them.",
    },
    approach: {
      description: "Custom fixtures were engineered to balance brand impact with interactive engagement — integrating display, lighting, and circulation into one cohesive shopping environment.",
      features: [
        { title: "Atrium Highwall", description: "A high-visibility backdrop built for maximum vertical presence, anchoring the department from across the floor." },
        { title: "Tester Bar", description: "A dedicated counter for hands-on trial, seating, and lighting tuned for close-range product interaction." },
        { title: "Standalone LFG Units", description: "Modular, freestanding fixtures that flex to feature rotating campaigns without disrupting the store plan." },
      ],
      images: ["/assets/sm1.png", "/assets/sm2.png"],
    },
    brandZoning: {
      description: "The design provides increased opportunities for multiple brands to showcase their product through flexible and well-zoned display areas within SM City Zamboanga. Layout and fixtures were planned to enhance visibility, allowing each brand to establish presence while maintaining a cohesive store experience.",
      images: ["/assets/sm3.png", "/assets/sm1.png"],
    },
    constructionImages: ["/assets/const1.png", "/assets/const2.png", "/assets/const3.png"],
    constructionNote: "This phase highlights on-site coordination and execution during the fit-out at SM City Zamboanga. Involvement included monitoring construction progress, coordinating with contractors and suppliers, and ensuring alignment with approved drawings and mall standards. Regular site visits and issue resolution were key in maintaining project timeline and quality.",
  },
  {
    slug: "look-at-me",
    title: "Look At Me - Mall of Asia",
    location: "Pasay City",
    image: "/assets/sm-look.png",
  },
  {
    slug: "watsons-mitsukoshi",
    title: "Watsons Mitsukoshi",
    location: "BGC, Taguig",
    image: "/assets/mitsukoshi.png",
  },
  {
    slug: "columna-residence",
    title: "Columna Residence",
    location: "Batangas",
    image: "/assets/columna.png",
  },
  {
    slug: "casa-gonzales",
    title: "Casa Gonzales",
    location: "Batangas",
    image: "/assets/casa-gonzales.png",
  },
  {
    slug: "silva-apartment",
    title: "Silva Apartment",
    location: "Laguna",
    image: "/assets/silva.png",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Project.deleteMany({});
    console.log("Cleared existing projects");

    await Project.insertMany(projects);
    console.log("Inserted 6 projects");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();