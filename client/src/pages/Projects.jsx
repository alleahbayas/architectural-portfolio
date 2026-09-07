import "./Projects.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import ProjectCard from "../components/ProjectCard";
import Logo from "../assets/logo.png";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProjects(data.slice(0, 4)))
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  return (
    <section id="projects">
      <div className="project-frame">
        <div className="project-background">
          <div className="logo">
            <img src={Logo} alt="logo" className="logo-img" />
          </div>

          <Link to="/archive" className="project-button project-button-desktop">
            <span className="project-button-text">View Archive</span>
            <span className="project-button-arrow">-&gt;</span>
          </Link>

          <div className="project-grid">
            <div className="left-content">
              <p className="page-label">
                <span className="page-label-line"></span>
                SELECTED WORKS
              </p>
              <h1 className="page-title">
                Thoughtfully{" "}
                <span className="page-title-accent">Designed</span>
              </h1>

              <ul className="project-list">
                {projects.map((project) => (
                  <li key={project._id} className="project-list-item">
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="project-cards-grid">
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

            <Link to="/archive" className="project-button project-button-mobile">
              <span className="project-button-text">View Archive</span>
              <span className="project-button-arrow">-&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;