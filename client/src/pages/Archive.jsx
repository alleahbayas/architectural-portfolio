import "./Archive.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API_URL from "../api";
import ProjectCard from "../components/ProjectCard";

function Archive() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    fetch(`${API_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProjects(data))  // <-- add this back
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="archive-frame">
      <section className="archive">
        <div className="archive-header">
          <button onClick={handleBack} className="archive-back">
            <span className="archive-back-text">Back</span>
            <ArrowLeft size={16} className="archive-back-arrow" />
          </button>

          <div className="archive-heading">
            <p className="archive-label">
              <span className="archive-label-line"></span>
              THE ARCHIVE
              <span className="archive-label-line"></span>
            </p>
            <h1 className="archive-title">
              Works in <em>Retrospect</em>
            </h1>
          </div>

          <span className="archive-est">EST. 2019</span>
        </div>

        <div className="archive-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              slug={project.slug}
              number={String(index + 1).padStart(2, "0")}
              title={project.title}
              location={project.location}
              image={project.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Archive;