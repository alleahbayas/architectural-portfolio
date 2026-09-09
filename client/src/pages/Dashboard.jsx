import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import API_URL from "../api";
import { authFetch } from "../utils/authFetch";
import Loading from "../components/Loading";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    const res = await authFetch(`/projects/${id}`, { method: "DELETE" });
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

  if (loading) return <Loading />;

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
    </div>
  );
}

export default Dashboard;