import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", brand: "", model: "", year: "", city: "",
    pricePerDay: "", description: "", fuelType: "Petrol",
    transmission: "Manual", seats: 5,
    contactPhone: "", contactEmail: "",
  });
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        if (data.owner._id !== user._id) {
          navigate("/my-garage");
          return;
        }
        setForm({
          title: data.title,
          brand: data.brand,
          model: data.model,
          year: data.year,
          city: data.city,
          pricePerDay: data.pricePerDay,
          description: data.description || "",
          fuelType: data.fuelType,
          transmission: data.transmission,
          seats: data.seats,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
        });
      } catch (err) {
        setError("Failed to load car details");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchCar();
  }, [id, user, navigate]);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'pricePerDay') {
      if (value && (parseFloat(value) <= 0 || parseFloat(value) < 0)) {
        setPriceError("Price must be a positive value. Enter a valid amount.");
      } else {
        setPriceError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPriceError("");
    
    if (!form.pricePerDay || form.pricePerDay <= 0) {
      setPriceError("Price cannot be negative or zero. Please enter a valid daily rental price.");
      return;
    }
    
    setLoading(true);
    try {
      await api.put(`/cars/${id}`, form);
      navigate("/my-garage");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <h2 className="section-title">Edit Your <span>Car</span></h2>
      <div className="divider" />
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row} className="form-row">
          <div className="form-group">
            <label>Listing Title</label>
            <input placeholder="e.g. Clean Swift for City Rides" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input placeholder="e.g. Bangalore" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
        <div style={styles.row} className="form-row">
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
            <input 
              type="number" 
              min="1900" 
              max={new Date().getFullYear() + 1} 
              placeholder="2020" 
              value={form.year} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (e.target.value === '' || (val >= 1900 && val <= new Date().getFullYear() + 1)) {
                  set("year", e.target.value);
                }
              }} 
              required 
            />
          </div>
        </div>
        <div style={styles.row} className="form-row">
          <div className="form-group">
            <label>Price Per Day (₹)</label>
            <input type="number" min="1" step="1" placeholder="1500" value={form.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} required />
            {priceError && <p className="error-msg" style={{ marginTop: '4px' }}>{priceError}</p>}
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
        <div style={styles.row} className="form-row">
          <div className="form-group">
            <label>Contact Phone</label>
            <input placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} required />
          </div>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="button" className="btn-outline" onClick={() => navigate("/my-garage")} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? "Updating..." : "Update Car"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  form: { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px", display: "flex", flexDirection: "column", gap: "4px" },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" },
};
