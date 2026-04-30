import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <div style={styles.hero}>
        <div style={styles.overlay} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={styles.heroTitle}>About <span style={{ color: "var(--accent)" }}>DriveEase</span></h1>
          <p style={styles.heroSub}>Connecting car owners and renters across India</p>
        </div>
      </div>

      <div className="page-container">
        <div style={styles.missionGrid}>
          <div>
            <h2 className="section-title">Our <span>Mission</span></h2>
            <div className="divider" />
            <p style={styles.text}>
              DriveEase was built to make car rental simple, transparent, and accessible for everyone.
              Whether you're a car owner looking to earn from your idle vehicle or a traveler needing
              a reliable ride — we've got you covered.
            </p>
            <p style={styles.text}>
              We believe in a peer-to-peer model where trust, transparency, and convenience
              drive every interaction on our platform.
            </p>
          </div>
          <div style={styles.statsGrid}>
            {[["500+", "Cars"], ["10,000+", "Renters"], ["50+", "Cities"], ["4.8", "Rating"]].map(([n, l]) => (
              <div key={l} style={styles.statCard}>
                <h3 style={styles.statNum}>{n}</h3>
                <p style={styles.statLabel}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: "56px" }}>Our <span>Values</span></h2>
        <div className="divider" />
        <div style={styles.valuesGrid}>
          {values.map((v) => (
            <div key={v.title} style={styles.valueCard}>
              <p style={styles.valueNum}>{v.num}</p>
              <h4 style={styles.valueTitle}>{v.title}</h4>
              <p style={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

const values = [
  { num: "01", title: "Trust", desc: "Every listing is verified and every renter is authenticated before use." },
  { num: "02", title: "Innovation", desc: "We continuously improve our platform for the best user experience." },
  { num: "03", title: "Accessibility", desc: "Available across 50+ cities with more being added every month." },
  { num: "04", title: "Security", desc: "Your data and transactions are always protected end-to-end." },
];

const styles = {
  hero: {
    height: "300px",
    background: "linear-gradient(135deg, var(--dark) 0%, var(--bg) 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", borderBottom: "1px solid var(--border)",
  },
  overlay: {
    position: "absolute", inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle at center, rgba(200,169,110,0.04) 0%, transparent 70%)",
  },
  heroTitle: { fontSize: "2.6rem", fontWeight: 800, color: "var(--white)", marginBottom: "10px" },
  heroSub: { color: "var(--text-muted)", fontSize: "1rem" },
  missionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" },
  text: { color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px", fontSize: "0.93rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  statCard: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "22px", textAlign: "center",
  },
  statNum: { fontSize: "1.8rem", fontWeight: 800, color: "var(--accent)", marginBottom: "4px" },
  statLabel: { color: "var(--text-muted)", fontSize: "0.85rem" },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" },
  valueCard: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "22px",
  },
  valueNum: { fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" },
  valueTitle: { color: "var(--white)", fontWeight: 600, marginBottom: "8px", fontSize: "0.95rem" },
  valueDesc: { color: "var(--text-muted)", fontSize: "0.84rem", lineHeight: 1.65 },
};
