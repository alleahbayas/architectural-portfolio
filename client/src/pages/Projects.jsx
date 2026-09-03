import "./Projects.css";
import { Link } from "react-router-dom";
import projects from "../data/Projects";
import ProjectCard from "../components/ProjectCard";
import Logo from "../assets/logo.png";

function Projects() {
  return (
    <section id="projects">
      <div className="project-frame">
        <div className="project-background">
          <div className="logo">
            <img src={Logo} alt="logo" className="logo-img" />
          </div>

          <Link to="/archive" className="project-button">
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
                  <li key={project.id} className="project-list-item">
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="project-cards-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  number={String(index + 1).padStart(2, "0")}
                  title={project.title}
                  location={project.location}
                  image={project.image}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;