import "./ProjectForm.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";
import { authFetch } from "../utils/authFetch";

const emptyProject = {
  slug: "",
  title: "",
  subtitle: "",
  location: "",
  image: "",
  category: "",
  disclaimer: "",
  meta: { projectType: "", designer: "", location: "" },
  brief: { intro: "", question: "", description: "" },
  approach: { description: "", features: [], images: [] },
  brandZoning: { description: "", images: [] },
  constructionImages: [],
  constructionNote: "",
};

function ProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyProject);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetch(`${API_URL}/projects`)
        .then((res) => res.json())
        .then((all) => {
          const existing = all.find((p) => p._id === id);
          if (existing) {
            setForm({
              ...emptyProject,
              ...existing,
              meta: { ...emptyProject.meta, ...existing.meta },
              brief: { ...emptyProject.brief, ...existing.brief },
              approach: { ...emptyProject.approach, ...existing.approach },
              brandZoning: { ...emptyProject.brandZoning, ...existing.brandZoning },
            });
          }
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateFeature = (index, field, value) => {
    setForm((prev) => {
      const features = [...prev.approach.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, approach: { ...prev.approach, features } };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      approach: {
        ...prev.approach,
        features: [...prev.approach.features, { title: "", description: "" }],
      },
    }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      approach: {
        ...prev.approach,
        features: prev.approach.features.filter((_, i) => i !== index),
      },
    }));
  };

  // ---- Image upload helpers -------------------------------------------

  // Uploads a single File to the backend and returns the hosted URL.
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("adminToken"); // match whatever key you store the admin token under
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // no Content-Type here — browser sets the multipart boundary
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }
    const data = await res.json();
    return data.url;
  };

  // For the single "Main Image" field.
  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      updateField("image", url);
    } catch (err) {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = ""; // lets the user re-select the same file if needed
    }
  };

  // For the array fields: approach.images, brandZoning.images, constructionImages.
  // Supports selecting multiple files at once.
  const handleListImageUpload = async (e, section) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(files.map(uploadFile));
      if (section === "constructionImages") {
        setForm((prev) => ({
          ...prev,
          constructionImages: [...prev.constructionImages, ...urls],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            images: [...prev[section].images, ...urls],
          },
        }));
      }
    } catch (err) {
      setError("One or more images failed to upload. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeListImage = (section, index) => {
    if (section === "constructionImages") {
      setForm((prev) => ({
        ...prev,
        constructionImages: prev.constructionImages.filter((_, i) => i !== index),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          images: prev[section].images.filter((_, i) => i !== index),
        },
      }));
    }
  };

  // -----------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = isEditing ? `/projects/${id}` : "/projects";
    const method = isEditing ? "PUT" : "POST";

    const res = await authFetch(endpoint, {
      method,
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-form-page">Loading...</div>;

  return (
    <div className="admin-form-page">
      <form onSubmit={handleSubmit} className="admin-form">
        <h1>{isEditing ? "Edit Project" : "Add New Project"}</h1>

        <h2>Basic Info</h2>
        <label>Slug (URL-friendly, e.g. sm-beauty)</label>
        <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />

        <label>Title</label>
        <input value={form.title} onChange={(e) => updateField("title", e.target.value)} required />

        <label>Subtitle</label>
        <input value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />

        <label>Location (card display)</label>
        <input value={form.location} onChange={(e) => updateField("location", e.target.value)} />

        <label>Main Image</label>
        {form.image && (
          <img src={form.image} alt="Main preview" className="admin-image-preview" />
        )}
        <input type="file" accept="image/*" onChange={handleSingleImageUpload} />
        {uploading && <p>Uploading...</p>}

        <label>Category</label>
        <input value={form.category} onChange={(e) => updateField("category", e.target.value)} />

        <label>Disclaimer</label>
        <textarea value={form.disclaimer} onChange={(e) => updateField("disclaimer", e.target.value)} />

        <h2>Meta</h2>
        <label>Project Type</label>
        <input value={form.meta.projectType} onChange={(e) => updateNested("meta", "projectType", e.target.value)} />

        <label>Designer / Role</label>
        <input value={form.meta.designer} onChange={(e) => updateNested("meta", "designer", e.target.value)} />

        <label>Meta Location</label>
        <input value={form.meta.location} onChange={(e) => updateNested("meta", "location", e.target.value)} />

        <h2>Brief</h2>
        <label>Intro line</label>
        <input value={form.brief.intro} onChange={(e) => updateNested("brief", "intro", e.target.value)} />

        <label>Question</label>
        <textarea value={form.brief.question} onChange={(e) => updateNested("brief", "question", e.target.value)} />

        <label>Description</label>
        <textarea rows={5} value={form.brief.description} onChange={(e) => updateNested("brief", "description", e.target.value)} />

        <h2>Approach &amp; Fixtures</h2>
        <label>Description</label>
        <textarea value={form.approach.description} onChange={(e) => updateNested("approach", "description", e.target.value)} />

        <label>Images</label>
        <div className="admin-image-grid">
          {form.approach.images.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("approach", i)}>×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => handleListImageUpload(e, "approach")} />

        <div className="admin-feature-list">
          {form.approach.features.map((feature, i) => (
            <div key={i} className="admin-feature-item">
              <input
                placeholder="Feature title"
                value={feature.title}
                onChange={(e) => updateFeature(i, "title", e.target.value)}
              />
              <textarea
                placeholder="Feature description"
                value={feature.description}
                onChange={(e) => updateFeature(i, "description", e.target.value)}
              />
              <button type="button" onClick={() => removeFeature(i)} className="admin-remove-btn">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="admin-add-btn">
            + Add Feature
          </button>
        </div>

        <h2>Brand Zoning</h2>
        <label>Description</label>
        <textarea value={form.brandZoning.description} onChange={(e) => updateNested("brandZoning", "description", e.target.value)} />

        <label>Images</label>
        <div className="admin-image-grid">
          {form.brandZoning.images.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("brandZoning", i)}>×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => handleListImageUpload(e, "brandZoning")} />

        <h2>Construction</h2>
        <label>Images</label>
        <div className="admin-image-grid">
          {form.constructionImages.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("constructionImages", i)}>×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => handleListImageUpload(e, "constructionImages")} />

        <label>Construction Note</label>
        <textarea value={form.constructionNote} onChange={(e) => updateField("constructionNote", e.target.value)} />

        {uploading && <p className="admin-form-uploading">Uploading image(s)...</p>}
        {error && <p className="admin-form-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="button" onClick={() => navigate("/admin/dashboard")} className="admin-btn admin-btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;