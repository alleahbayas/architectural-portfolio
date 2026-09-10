import "./ProjectForm.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
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
  sections: {
    overview: { num: "01", label: "OVERVIEW" },
    features: { num: "02", label: "FEATURES" },
    brandZoning: { num: "03", label: "BRAND ZONING" },
    construction: { num: "04", label: "CONSTRUCTION" },
  },
  visible: true,
};

// Set the image cap per section here. Change brandZoning to whatever limit you want.
const MAX_IMAGES_BY_SECTION = {
  approach: 3,
  brandZoning: 2,
  constructionImages: 3,
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
              sections: {
                overview: { ...emptyProject.sections.overview, ...existing.sections?.overview },
                features: { ...emptyProject.sections.features, ...existing.sections?.features },
                brandZoning: { ...emptyProject.sections.brandZoning, ...existing.sections?.brandZoning },
                construction: { ...emptyProject.sections.construction, ...existing.sections?.construction },
              },
              visible: existing.visible !== undefined ? existing.visible : true,
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

  // For sections.overview.num, sections.features.label, etc.
  const updateSectionField = (sectionKey, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: { ...prev.sections[sectionKey], [field]: value },
      },
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

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }
    const data = await res.json();
    return data.url;
  };

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
      e.target.value = "";
    }
  };

  const removeMainImage = () => {
    updateField("image", "");
  };

  const getListImages = (section) =>
    section === "constructionImages" ? form.constructionImages : form[section].images;

  const handleListImageUpload = async (e, section) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const maxImages = MAX_IMAGES_BY_SECTION[section];
    const currentCount = getListImages(section).length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      setError(`You can only add up to ${maxImages} images here.`);
      e.target.value = "";
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(filesToUpload.map(uploadFile));
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

  const renderAddImageSlot = (section) => {
    const maxImages = MAX_IMAGES_BY_SECTION[section];
    const count = getListImages(section).length;
    if (count >= maxImages) return null;

    return (
      <label className="admin-image-add-slot">
        <Plus size={20} />
        <span>{count}/{maxImages}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleListImageUpload(e, section)}
        />
      </label>
    );
  };

  return (
    <div className="admin-form-page">
      <form onSubmit={handleSubmit} className="admin-form">
        <h1>{isEditing ? "Edit Project" : "Add New Project"}</h1>

        <h2>Main Page</h2>
        <label>Slug (URL-friendly, e.g. sm-beauty)</label>
        <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />

        <label>Title</label>
        <input value={form.title} onChange={(e) => updateField("title", e.target.value)} required />

        <label>Subtitle</label>
        <input value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />

        <label>Location (card display)</label>
        <input value={form.location} onChange={(e) => updateField("location", e.target.value)} />

        <label>Main Image</label>
        {form.image ? (
          <div className="admin-image-preview-wrapper">
            <img src={form.image} alt="Main preview" className="admin-image-preview" />
            <button
              type="button"
              onClick={removeMainImage}
              aria-label="Remove main image"
              className="admin-image-remove-btn"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleSingleImageUpload} />
        )}
        {uploading && <p>Uploading...</p>}

        <label>Category</label>
        <input value={form.category} onChange={(e) => updateField("category", e.target.value)} />

        <label>Disclaimer</label>
        <textarea value={form.disclaimer} onChange={(e) => updateField("disclaimer", e.target.value)} />

        <h2>Details</h2>
        <label>Project Type</label>
        <input value={form.meta.projectType} onChange={(e) => updateNested("meta", "projectType", e.target.value)} />

        <label>Project Role</label>
        <input value={form.meta.designer} onChange={(e) => updateNested("meta", "designer", e.target.value)} />

        <label>Location</label>
        <input value={form.meta.location} onChange={(e) => updateNested("meta", "location", e.target.value)} />

        <h2>Introduction</h2>
        <label>Section Number</label>
        <input
          value={form.sections.overview.num}
          onChange={(e) => updateSectionField("overview", "num", e.target.value)}
          placeholder="01"
        />

        <label>Section Label</label>
        <input
          value={form.sections.overview.label}
          onChange={(e) => updateSectionField("overview", "label", e.target.value)}
          placeholder="OVERVIEW"
        />

        <label>Intro line</label>
        <input value={form.brief.intro} onChange={(e) => updateNested("brief", "intro", e.target.value)} />

        <label>Question</label>
        <textarea value={form.brief.question} onChange={(e) => updateNested("brief", "question", e.target.value)} />

        <label>Description</label>
        <textarea rows={5} value={form.brief.description} onChange={(e) => updateNested("brief", "description", e.target.value)} />

        <h2>Features</h2>
        <label>Section Number</label>
        <input
          value={form.sections.features.num}
          onChange={(e) => updateSectionField("features", "num", e.target.value)}
          placeholder="02"
        />

        <label>Section Label</label>
        <input
          value={form.sections.features.label}
          onChange={(e) => updateSectionField("features", "label", e.target.value)}
          placeholder="FEATURES"
        />

        <label>Description</label>
        <textarea value={form.approach.description} onChange={(e) => updateNested("approach", "description", e.target.value)} />

        <label>Images (max {MAX_IMAGES_BY_SECTION.approach})</label>
        <div className="admin-image-grid">
          {form.approach.images.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("approach", i)}>×</button>
            </div>
          ))}
          {renderAddImageSlot("approach")}
        </div>

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
        <label>Section Number</label>
        <input
          value={form.sections.brandZoning.num}
          onChange={(e) => updateSectionField("brandZoning", "num", e.target.value)}
          placeholder="03"
        />

        <label>Section Label</label>
        <input
          value={form.sections.brandZoning.label}
          onChange={(e) => updateSectionField("brandZoning", "label", e.target.value)}
          placeholder="BRAND ZONING"
        />

        <label>Description</label>
        <textarea value={form.brandZoning.description} onChange={(e) => updateNested("brandZoning", "description", e.target.value)} />

        <label>Images (max {MAX_IMAGES_BY_SECTION.brandZoning})</label>
        <div className="admin-image-grid">
          {form.brandZoning.images.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("brandZoning", i)}>×</button>
            </div>
          ))}
          {renderAddImageSlot("brandZoning")}
        </div>

        <h2>Construction</h2>
        <label>Section Number</label>
        <input
          value={form.sections.construction.num}
          onChange={(e) => updateSectionField("construction", "num", e.target.value)}
          placeholder="04"
        />

        <label>Section Label</label>
        <input
          value={form.sections.construction.label}
          onChange={(e) => updateSectionField("construction", "label", e.target.value)}
          placeholder="CONSTRUCTION"
        />

        <label>Images (max {MAX_IMAGES_BY_SECTION.constructionImages})</label>
        <div className="admin-image-grid">
          {form.constructionImages.map((url, i) => (
            <div key={i} className="admin-image-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeListImage("constructionImages", i)}>×</button>
            </div>
          ))}
          {renderAddImageSlot("constructionImages")}
        </div>

        <label>Construction Note</label>
        <textarea value={form.constructionNote} onChange={(e) => updateField("constructionNote", e.target.value)} />

        {uploading && <p className="admin-form-uploading">Uploading image(s)...</p>}
        {error && <p className="admin-form-error">{error}</p>}

        <label className="admin-toggle-row">
          <span className="admin-toggle-label">Show on Projects Page</span>
          <span className="admin-toggle">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => updateField("visible", e.target.checked)}
            />
            <span className="admin-toggle-slider"></span>
          </span>
        </label>

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