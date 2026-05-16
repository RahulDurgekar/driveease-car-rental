import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function PostCar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", brand: "", model: "", year: "", city: "",
    pricePerDay: "", description: "", fuelType: "Petrol",
    transmission: "Manual", seats: 5,
    contactPhone: "", contactEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        city: user.city || "",
        contactPhone: user.phone || "",
        contactEmail: user.email || "",
      }));
    }
  }, [user]);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (fileRef.current?.files.length) {
        Array.from(fileRef.current.files).forEach(f => formData.append("images", f));
      }
      await api.post("/cars", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/my-garage");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <h2 className="section-title">Post Your <span>Car</span></h2>
      <div className="divider" />
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div className="form-group">
            <label>Listing Title</label>
            <input placeholder="e.g. Clean Swift for City Rides" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input placeholder="e.g. Bangalore" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
        <div style={styles.row}>
          <div className="form-group">
            <label>Brand</label>
            <input placeholder="e.g. Maruti" value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input placeholder="e.g. Swift" value={form.model} onChange={(e) => set("model", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input type="number" placeholder="2020" value={form.year} onChange={(e) => set("year", e.target.value)} required />
          </div>
        </div>
        <div style={styles.row}>
          <div className="form-group">
            <label>Price Per Day (₹)</label>
            <input type="number" placeholder="1500" value={form.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Fuel Type</label>
            <select value={form.fuelType} onChange={(e) => set("fuelType", e.target.value)}>
              {["Petrol", "Diesel", "Electric", "Hybrid"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Transmission</label>
            <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
              <option>Manual</option>
              <option>Automatic</option>
            </select>
          </div>
          <div className="form-group">
            <label>Seats</label>
            <input type="number" value={form.seats} min={2} max={10} onChange={(e) => set("seats", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} placeholder="Describe your car..." value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div style={styles.row}>
          <div className="form-group">
            <label>Contact Phone</label>
            <input placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label>Car Images (up to 6)</label>
          <input type="file" ref={fileRef} accept="image/*" multiple />
          <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Select multiple images from your device</small>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Posting..." : "Post Car"}</button>
      </form>
    </div>
  );
}

const styles = {
  form: { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px", display: "flex", flexDirection: "column", gap: "4px" },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" },
};
