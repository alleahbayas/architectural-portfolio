import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Upload } from "lucide-react";
import API_URL from "../api";
import { authFetch } from "../utils/authFetch";
import Loading from "../components/Loading";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({ resumeUrl: "", resumeFileName: "", linkedinUrl: "" });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  const fetchSettings = async () => {
    const res = await fetch(`${API_URL}/settings`);
    const data = await res.json();
    setSettings(data);
    setSettingsLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    const res = await authFetch(`/projects/${id}`, { method: "DELETE" });
    if (!res) return;
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert("Failed to delete project.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    setSettingsError("");
    setSettingsSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Resume upload failed");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, resumeUrl: data.url, resumeFileName: data.fileName }));
      setSettingsSuccess("Resume uploaded. Click Save to apply.");
    } catch (err) {
      setSettingsError("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Delete the current resume?")) return;

    setSettingsError("");
    setSettingsSuccess("");

    const res = await authFetch("/resume", { method: "DELETE" });
    if (!res) return;

    if (res.ok) {
      const data = await res.json();
      setSettings(data);
      setSettingsSuccess("Resume deleted.");
    } else {
      setSettingsError("Failed to delete resume.");
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess("");

    const res = await authFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });

    if (!res) return;

    if (res.ok) {
      setSettingsSuccess("Settings saved.");
    } else {
      setSettingsError("Failed to save settings.");
    }
    setSavingSettings(false);
  };

  if (loading || settingsLoading) return <Loading variant="admin" />;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Manage Projects</h1>
        <div className="admin-dashboard-actions">
          <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add Project
          </Link>
          <button onClick={handleLogout} className="admin-btn admin-btn-outline">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-project-list">
          {projects.map((project) => (
            <div key={project._id} className="admin-project-row">
              <img src={project.image} alt={project.title} className="admin-project-thumb" />
              <div className="admin-project-info">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
                <span className="admin-project-slug">/{project.slug}</span>
              </div>
              <div className="admin-project-row-actions">
                <Link to={`/admin/projects/edit/${project._id}`} className="admin-icon-btn">
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(project._id, project.title)}
                  className="admin-icon-btn admin-icon-btn-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-settings-section">
          <h2>Site Settings</h2>

          <label>Resume / CV</label>
          {settings.resumeUrl ? (
            <div className="admin-resume-row">
              <a href={`${API_URL}/download-resume`} className="admin-resume-filename">
                {settings.resumeFileName || "View current resume"}
              </a>
              <div className="admin-resume-actions">
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="admin-icon-btn admin-icon-btn-danger"
                  aria-label="Delete resume"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="admin-resume-empty">No resume uploaded yet.</p>
          )}
          <label className="admin-upload-btn">
            <Upload size={16} />
            {uploadingResume ? "Uploading..." : "Upload New Resume (PDF)"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
            />
          </label>

          <label>LinkedIn Profile URL</label>
          <input
            type="url"
            value={settings.linkedinUrl}
            onChange={(e) => setSettings((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
            placeholder="https://www.linkedin.com/in/yourname"
          />

          {settingsError && <p className="admin-form-error">{settingsError}</p>}
          {settingsSuccess && <p className="admin-settings-success">{settingsSuccess}</p>}

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings || uploadingResume}
            className="admin-btn admin-btn-primary"
            style={{ marginTop: "16px" }}
          >
            {savingSettings ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;