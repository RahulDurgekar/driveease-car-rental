import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", avatar: "", role: "user" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        avatar: user.avatar || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      setUser(data);
      setMsg("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "600px" }}>
      <div style={styles.header}>
        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="section-title" style={{ marginBottom: "4px" }}>My <span>Profile</span></h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{user?.email}</p>
        </div>
      </div>
      <div className="divider" />

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="form-group">
          <label>City</label>
          <input placeholder="Bangalore" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Full Address</label>
          <textarea
            rows={3}
            placeholder="Enter your complete address (street, area, postal code). This will be visible to customers when they book your car."
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ resize: "vertical" }}
          />
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            This address will be shown to renters for car pickup
          </p>
        </div>

        <div className="form-group">
          <label>Avatar URL</label>
          <input placeholder="https://..." value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">Renter (I want to book cars)</option>
            <option value="owner">Owner (I want to list cars)</option>
          </select>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {form.role === "owner" ? "You can post cars and receive bookings" : "You can browse and book available cars"}
          </p>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {msg && <p className="success-msg">{msg}</p>}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "8px" },
  avatar: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "var(--accent)", color: "var(--black)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.6rem", fontWeight: 800, flexShrink: 0,
  },
  form: { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px" },
};
