import "./Career.css";
import career from "../data/Career";
import certificates from "../data/Certificates";

function Career() {
  return (
    <section id="career">
      <div className="career-columns">
        <div className="career-left">
          <h1 className="career-label">
            <span className="career-label-line"></span>
            THE PATH
          </h1>

          <h1 className="career-title">Where I've Been</h1>

          <div className="timeline">
            {career.map((group, groupIndex) => (
              <div className="timeline-group" key={groupIndex}>
                <div className="timeline-year-cell">{group.yearRange}</div>

                <div className="timeline-dot-cell">
                  <span className="timeline-dot"></span>
                </div>

                <div className="timeline-content-cell">
                  {group.positions.map((pos, posIndex) => (
                    <div className="timeline-position" key={posIndex}>
                      <h3 className="position-title">
                        {pos.title}
                        {pos.dateRange && (
                          <span className="position-date">
                            {" "}
                            ({pos.dateRange})
                          </span>
                        )}
                      </h3>

                      {pos.company && (
                        <p className="position-company">{pos.company}</p>
                      )}

                      {pos.bullets && pos.bullets.length > 0 && (
                        <ul className="position-bullets">
                          {pos.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="career-right">
          <div className="certificate-box-wrapper">
            <div className="certificate-box">
              <h1 className="certificate-title">Certifications</h1>

              {certificates.map((cert, index) => (
                <div key={index} className="certificate-item">
                  <h4 className="certificate-name">{cert.title}</h4>
                  {cert.location && cert.location.trim() !== "" && (
                    <p className="certificate-location">{cert.location}</p>
                  )}
                  <p className="certificate-year">{cert.year}</p>

                  {index < certificates.length - 1 && (
                    <div className="certificate-divider"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Career;