import "./Loading.css";

function Loading({ variant = "page", label, titleMain, titleAccent, subLabel }) {
  const isAdmin = variant === "admin";

  const displayLabel = isAdmin ? "ADMIN PANEL" : label;
  const displayTitleMain = isAdmin ? "Hello," : titleMain;
  const displayTitleAccent = isAdmin ? "Admin" : titleAccent;

  return (
    <div className="loading-screen loading-page">
      {displayLabel && (
        <p className="loading-label">
          <span className="loading-label-line"></span>
          {displayLabel}
          <span className="loading-label-line"></span>
        </p>
      )}

      <h1 className="loading-title">
        {displayTitleMain}{" "}
        {displayTitleAccent && (
          <span className="loading-title-accent">{displayTitleAccent}</span>
        )}
      </h1>

      {!isAdmin && subLabel && <p className="loading-sublabel">{subLabel}</p>}

      <div className="loading-bar">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  );
}

export default Loading;