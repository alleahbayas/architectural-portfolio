import "./Loading.css";

function Loading({ variant = "page", label, titleMain, titleAccent, subLabel }) {
  if (variant === "admin") {
    return (
      <div className="loading-screen loading-admin">
        <p className="loading-admin-text">Logging in</p>
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen loading-page">
      {label && (
        <p className="loading-label">
          <span className="loading-label-line"></span>
          {label}
          <span className="loading-label-line"></span>
        </p>
      )}

      <h1 className="loading-title">
        {titleMain}{" "}
        {titleAccent && <span className="loading-title-accent">{titleAccent}</span>}
      </h1>

      {subLabel && <p className="loading-sublabel">{subLabel}</p>}

      <div className="loading-bar">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  );
}

export default Loading;