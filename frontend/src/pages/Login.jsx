import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data && data.token && data.user) {
        login(data.token, data.user);
      } else {
        setError("Invalid response from server");
        setLoading(false);
      }
    } catch (err) {
      if (!err.response) {
        setError("Cannot connect to server. Please ensure the backend is running.");
      } else {
        setError(err.response.data?.message || "Invalid email or password");
      }
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <span style={styles.brand}>DriveEase</span>
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrap}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: "44px" }}
                required
              />
              <button type="button" style={styles.peekBtn} onClick={() => setShowPass((s) => !s)} aria-label="Toggle password visibility">
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p className="error-msg" style={{ marginBottom: "12px" }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "4px" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "20px", background: "var(--dark)",
  },
  card: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "10px", padding: "40px 36px", width: "100%", maxWidth: "420px",
  },
  brandRow: { marginBottom: "24px" },
  brand: { fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.5px" },
  title: { fontSize: "1.6rem", fontWeight: 700, color: "var(--white)", marginBottom: "6px" },
  sub: { color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "28px" },
  footer: { textAlign: "center", marginTop: "20px", color: "var(--text-muted)", fontSize: "0.85rem" },
  inputWrap: { position: "relative" },
  peekBtn: {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    color: "var(--text-muted)", display: "flex", alignItems: "center",
    padding: "0", lineHeight: 1,
    transition: "color 0.15s",
  },
};
