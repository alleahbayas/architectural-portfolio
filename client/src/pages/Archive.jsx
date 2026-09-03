import "./Archive.css";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import projects from "../data/Projects";
import ProjectCard from "../components/ProjectCard";

function Archive() {
  return (
    <section className="archive">
      <div className="archive-header">
        <Link to="/#projects" className="archive-back">
          <span className="archive-back-text">Back</span>
          <ArrowLeft size={16} className="archive-back-arrow" />
        </Link>

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
            key={project.id}
            number={String(index + 1).padStart(2, "0")}
            title={project.title}
            location={project.location}
            image={project.image}
          />
        ))}
      </div>
    </section>
  );
}

export default Archive;