import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const BG = "/src/assets/car-bg.png";

export default function Home() {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?city=${city}`);
  };

  return (
    <>
      <section style={{ ...styles.hero, backgroundImage: `url(${BG})` }}>
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroSub}>Premium Car Rental Service</p>
          <h1 style={styles.heroTitle}>
            Drive Your <span style={{ color: "var(--accent)" }}>Dream Car</span><br />Today
          </h1>
          <p style={styles.heroDesc}>
            Find and book the perfect car for your journey. Hundreds of cars across India.
          </p>
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <input
              placeholder="Enter city (e.g. Bangalore)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: "0 6px 6px 0", padding: "0 28px", height: "44px" }}>
              Search
            </button>
          </form>
        </div>
      </section>

      <section style={styles.statsBar}>
        {[["500+", "Cars Listed"], ["10,000+", "Happy Renters"], ["50+", "Cities"], ["4.8 / 5", "Avg Rating"]].map(([num, label]) => (
          <div key={label} style={styles.statItem}>
            <h3 style={styles.statNum}>{num}</h3>
            <p style={styles.statLabel}>{label}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <div className="page-container">
          <h2 className="section-title">Why Choose <span>DriveEase?</span></h2>
          <div className="divider" />
          <div style={styles.grid3}>
            {features.map((f) => (
              <div key={f.title} style={styles.featureCard}>
                <p style={styles.featureNum}>{f.num}</p>
                <h4 style={styles.featureTitle}>{f.title}</h4>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: "var(--dark)" }}>
        <div className="page-container">
          <h2 className="section-title">How It <span>Works</span></h2>
          <div className="divider" />
          <div style={styles.steps}>
            {steps.map((s, i) => (
              <div key={s.title} style={styles.step}>
                <div style={styles.stepNum}>{i + 1}</div>
                <h4 style={styles.featureTitle}>{s.title}</h4>
                <p style={styles.featureDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

const features = [
  { num: "01", title: "Wide Selection", desc: "Choose from hundreds of cars across multiple cities and categories." },
  { num: "02", title: "Secure Booking", desc: "Your data is fully protected with industry-grade security." },
  { num: "03", title: "Instant Confirmation", desc: "Get booking confirmation instantly and hit the road without delays." },
  { num: "04", title: "Best Prices", desc: "Competitive daily rates with no hidden charges or surprise fees." },
  { num: "05", title: "City-wise Filter", desc: "Filter cars by your city and find the nearest available vehicle." },
  { num: "06", title: "Verified Reviews", desc: "Read genuine reviews from real renters before making a decision." },
];

const steps = [
  { title: "Search", desc: "Enter your city and browse available cars." },
  { title: "Book", desc: "Select dates, times and confirm your booking." },
  { title: "Drive", desc: "Pick up the car and enjoy your journey." },
];

const styles = {
  hero: {
    minHeight: "92vh", backgroundSize: "cover", backgroundPosition: "center",
    display: "flex", alignItems: "center", position: "relative",
  },
  overlay: {
    position: "absolute", inset: 0,
    pointerEvents: "none",
    background: "linear-gradient(120deg, rgba(14,14,14,0.88) 0%, rgba(14,14,14,0.55) 100%)",
  },
  heroContent: { position: "relative", zIndex: 1, maxWidth: "640px", padding: "0 48px" },
  heroSub: {
    color: "var(--accent)", fontWeight: 600, letterSpacing: "2.5px",
    fontSize: "0.78rem", textTransform: "uppercase", marginBottom: "14px",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 800,
    color: "var(--white)", lineHeight: 1.15, marginBottom: "16px",
  },
  heroDesc: { color: "var(--text-muted)", fontSize: "1rem", marginBottom: "32px", lineHeight: 1.75 },
  searchBar: { display: "flex", maxWidth: "460px" },
  searchInput: {
    borderRadius: "6px 0 0 6px", border: "1px solid var(--accent)",
    borderRight: "none", flex: 1, height: "44px",
  },
  statsBar: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    background: "var(--accent)", padding: "24px 48px",
  },
  statItem: { textAlign: "center" },
  statNum: { fontSize: "1.7rem", fontWeight: 800, color: "var(--black)" },
  statLabel: { fontSize: "0.8rem", color: "var(--black)", fontWeight: 500, marginTop: "2px" },
  section: { padding: "64px 0" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" },
  featureCard: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "24px 22px",
  },
  featureNum: { fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" },
  featureTitle: { color: "var(--white)", fontWeight: 600, marginBottom: "8px", fontSize: "0.95rem" },
  featureDesc: { color: "var(--text-muted)", fontSize: "0.86rem", lineHeight: 1.65 },
  steps: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
  step: { textAlign: "center", padding: "28px 20px" },
  stepNum: {
    width: "48px", height: "48px", borderRadius: "50%",
    background: "var(--accent)", color: "var(--black)",
    fontWeight: 800, fontSize: "1.2rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
};
