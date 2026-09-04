import "./Overview.css";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PenLine, User, MapPin } from "lucide-react";
import projects from "../data/Projects";
import Footer from "../components/Footer";

function Overview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!project) {
    return (
      <div className="detail-frame">
        <section className="detail-empty">
          <p>Project not found.</p>
          <button onClick={handleBack} className="detail-back-simple">Back to Projects</button>
        </section>
      </div>
    );
  }

  return (
    <div className="detail-frame">
      {/* --- Hero --- */}
      <section className="detail-hero">
        <div className="detail-hero-left">
          <button onClick={handleBack} className="detail-back">
            <ArrowLeft size={16} />
            PREVIOUS
          </button>

          {project.category && (
            <p className="detail-label">OVERVIEW · {project.category}</p>
          )}

          <h1 className="detail-title">
            {project.title}
            <br />
            <em>{project.subtitle}</em>
          </h1>

          {project.disclaimer && (
            <p className="detail-disclaimer">
              <strong>Disclaimer:</strong> {project.disclaimer}
            </p>
          )}
        </div>

        <div
          className="detail-hero-right"
          style={{ backgroundImage: `url(${project.image})` }}
        ></div>
      </section>

      {/* --- 001 - Overview --- */}
      {(project.meta || project.brief) && (
        <>
          <div className="detail-overview-card">
            {project.meta && (
              <div className="detail-meta-row">
                {project.meta.projectType && (
                  <div className="meta-item">
                    <span className="meta-icon">
                      <PenLine size={18} />
                    </span>
                    <div className="meta-text">
                      <span className="meta-label">PROJECT TYPE</span>
                      <span className="meta-value">{project.meta.projectType}</span>
                    </div>
                  </div>
                )}
                {project.meta.designer && (
                  <div className="meta-item">
                    <span className="meta-icon">
                      <User size={18} />
                    </span>
                    <div className="meta-text">
                      <span className="meta-label">PROJECT ROLE</span>
                      <span className="meta-value">{project.meta.designer}</span>
                    </div>
                  </div>
                )}
                {project.meta.location && (
                  <div className="meta-item">
                    <span className="meta-icon">
                      <MapPin size={18} />
                    </span>
                    <div className="meta-text">
                      <span className="meta-label">LOCATION</span>
                      <span className="meta-value">{project.meta.location}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {project.brief && (
              <div className="detail-brief">
                <span className="brief-num">01</span>
                <span className="brief-label">OVERVIEW</span>
                <div className="brief-question-block">
                  <span className="brief-intro">{project.brief.intro}</span>
                  <h2 className="brief-question">{project.brief.question}</h2>
                </div>
                <div className="brief-desc-block">
                  {project.brief.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <span className="brief-desc-line"></span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- 002 - Approach & Fixtures --- */}
      {project.approach && (
        <div className="detail-features-row">
          <span className="section-num">02</span>
          <span className="section-label">APPROACH &amp; FIXTURES</span>
          <div className="detail-features-list">
            <p className="approach-description">{project.approach.description}</p>

            {project.approach.features?.map((feature, i) => (
              <div key={i} className="feature-item">
                <span className="feature-index">{["i", "ii", "iii", "iv", "v"][i] || i + 1}.</span>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {project.approach.images && (
            <div className="detail-side-images">
              {project.approach.images.map((img, i) => (
                <img key={i} src={img} alt={`${project.title} approach ${i + 1}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- 003 - Brand Zoning --- */}
      {project.brandZoning && (
          <>
            <div className="detail-brand-section">
              <div className="detail-brand-block">
                {project.brandZoning.images && project.brandZoning.images[0] && (
                  <img
                    src={project.brandZoning.images[0]}
                    alt={`${project.title} brand zoning`}
                    className="detail-brand-img"
                  />
                )}
                {project.brandZoning.images && project.brandZoning.images[1] && (
                  <div className="detail-brand-grid">
                    <img
                      src={project.brandZoning.images[1]}
                      alt={`${project.title} brand zoning secondary`}
                      className="detail-brand-img-small"
                    />
                    <div>
                      <span className="brand-num">03</span>
                      <span className="brand-label">BRAND ZONING</span>
                      <p className="detail-brand-note">{project.brandZoning.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      {/* --- 04 - Construction --- */}
      {project.constructionImages && (
        <div className="detail-construction">
          <div className="section-num-row">
            <span className="construction-num">04</span>
            <span className="construction-label">CONSTRUCTION</span>
          </div>
          <div className="construction-grid">
            {project.constructionImages.map((img, i) => (
              <img key={i} src={img} alt={`Construction phase ${i + 1}`} />
            ))}
          </div>
          {project.constructionNote && (
            <p className="construction-note">{project.constructionNote}</p>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Overview;