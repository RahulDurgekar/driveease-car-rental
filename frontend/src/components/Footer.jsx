import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <h3 style={styles.logo}>DriveEase</h3>
          <p style={styles.tagline}>Your journey, your way.</p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/cars" style={styles.link}>Browse Cars</Link>
          <Link to="/about" style={styles.link}>About Us</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Account</h4>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
          <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
          <Link to="/post-car" style={styles.link}>Post a Car</Link>
        </div>
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact</h4>
          <p style={styles.link}>support@driveease.com</p>
          <p style={styles.link}>+91 7892554221</p>
          <p style={styles.link}>BTM Layout Bangalore, India 560001</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
          © {new Date().getFullYear()} DriveEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "var(--dark)", borderTop: "1px solid var(--border)", marginTop: "60px" },
  inner: { maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "32px" },
  brand: {},
  logo: { fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", letterSpacing: "0.3px" },
  tagline: { color: "var(--text-muted)", fontSize: "0.88rem" },
  col: { display: "flex", flexDirection: "column", gap: "10px" },
  colTitle: { color: "var(--white)", fontWeight: 600, marginBottom: "4px", fontSize: "0.95rem" },
  link: { color: "var(--text-muted)", fontSize: "0.85rem", transition: "color 0.2s" },
  bottom: { borderTop: "1px solid var(--border)", padding: "16px 20px", textAlign: "center" },
};
