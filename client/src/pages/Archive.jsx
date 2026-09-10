import "./Archive.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API_URL from "../api";
import ProjectCard from "../components/ProjectCard";
import Loading from "../components/Loading";

function Archive() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const startTime = Date.now();

    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);

        setTimeout(() => {
          setProjects(data);
          setLoading(false);
        }, remaining);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      });
  }, []);

  const handleBack = () => {
    navigate("/", { state: { scrollTo: "projects" } });
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) return <Loading label="THE ARCHIVE" titleMain="Works in" titleAccent="Retrospect" />;

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
              from="archive"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Archive;