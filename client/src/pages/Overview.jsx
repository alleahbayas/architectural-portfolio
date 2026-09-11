import "./Overview.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, PenLine, User, MapPin } from "lucide-react";
import API_URL from "../api";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import FadeIn from "../components/FadeIn";

function Overview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);

    const startTime = Date.now();

    fetch(`${API_URL}/projects/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject(data);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(2000 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      })
      .catch(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(2000 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      });
  }, [slug]);

  const handleBack = () => {
    const from = location.state?.from;

    if (from === "archive") {
      navigate("/archive");
    } else {
      navigate("/", { state: { scrollTo: "projects" } });
    }
  };

  if (loading) {
    return (
      <Loading
        label="PROJECT OVERVIEW"
        titleMain={project?.title}
        titleAccent={project?.subtitle}
        subLabel={project?.meta?.location || project?.location}
      />
    );
  }

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

  const overviewSection = project.sections?.overview || { num: "01", label: "OVERVIEW" };
  const featuresSection = project.sections?.features || { num: "02", label: "FEATURES" };
  const brandZoningSection = project.sections?.brandZoning || { num: "03", label: "BRAND ZONING" };
  const constructionSection = project.sections?.construction || { num: "04", label: "CONSTRUCTION" };

  const hasQuestionBlock = Boolean(project.brief?.intro || project.brief?.question);

  return (
    <FadeIn>
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
              {project.title}<span>-</span>
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

        {/* --- 01 - Overview --- */}
        {(project.meta || project.brief) && (
          <FadeIn>
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
                <>
                  <div className="brief-num-row">
                    <span className="brief-num">{overviewSection.num}</span>
                    <span className="section-line"></span>
                    <span className="brief-label">{overviewSection.label}</span>
                  </div>
                  <div className={`detail-brief ${!hasQuestionBlock ? "detail-brief-single" : ""}`}>
                    {hasQuestionBlock && (
                      <div className="brief-question-block">
                        <span className="brief-intro">{project.brief.intro}</span>
                        <h2 className="brief-question">{project.brief.question}</h2>
                      </div>
                    )}
                    <div className="brief-desc-block">
                      {project.brief.description.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                      <span className="brief-desc-line"></span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        )}

        {/* --- 02 - Features --- */}
        {project.approach && (
          <>
          <FadeIn>
              <div className="approach-num-row">
                <span className="section-num">{featuresSection.num}</span>
                <span className="dark-section-line"></span>
                <span className="section-label">{featuresSection.label}</span>
              </div>
              <div className="detail-features-row">
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
            </FadeIn>
          </>
        )}

        {/* --- 03 - Brand Zoning --- */}
        {project.brandZoning && (
          <FadeIn>
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
                      <div className="brand-num-row">
                        <span className="brand-num">{brandZoningSection.num}</span>
                        <span className="section-line"></span>
                        <span className="brand-label">{brandZoningSection.label}</span>
                      </div>
                      <p className="detail-brand-note">{project.brandZoning.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* --- 04 - Construction --- */}
        {project.constructionImages && (
          <FadeIn>
            <div className="detail-construction">
              <div className="section-num-row">
                <span className="construction-num">{constructionSection.num}</span>
                <span className="dark-section-line"></span>
                <span className="construction-label">{constructionSection.label}</span>
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
          </FadeIn>
        )}

        <Footer />
      </div>
    </FadeIn>
  );
}

export default Overview;