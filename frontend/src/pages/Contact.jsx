import { useState } from "react";
import Footer from "../components/Footer";

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <div style={styles.hero}>
        <div style={styles.overlay} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={styles.heroTitle}>Get In <span style={{ color: "var(--accent)" }}>Touch</span></h1>
          <p style={styles.heroSub}>We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="page-container">
        <div style={styles.grid}>
          <div>
            <h2 className="section-title">Send Us a <span>Message</span></h2>
            <div className="divider" />
            {sent ? (
              <div style={styles.successBox}>
                <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "1rem" }}>Message sent successfully</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" style={{ marginTop: "16px" }} onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={5} placeholder="Write your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            )}
          </div>

          <div>
            <h2 className="section-title">Contact <span>Info</span></h2>
            <div className="divider" />
            {contactInfo.map((c) => (
              <div key={c.label} style={styles.infoCard}>
                <span style={styles.infoIcon}><c.Icon /></span>
                <div>
                  <p style={styles.infoLabel}>{c.label}</p>
                  <p style={styles.infoValue}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const contactInfo = [
  { Icon: MailIcon,   label: "Email",         value: "support@driveease.com" },
  { Icon: PhoneIcon,  label: "Phone",         value: "+91 7892554221" },
  { Icon: MapPinIcon, label: "Address",       value: "BTM Layout, Bangalore, Karnataka 560001" },
  { Icon: ClockIcon,  label: "Working Hours", value: "Mon – Sat: 9 AM – 7 PM IST" },
];

const styles = {
  hero: {
    height: "260px",
    background: "linear-gradient(135deg, var(--dark) 0%, var(--bg) 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", borderBottom: "1px solid var(--border)",
  },
  overlay: {
    position: "absolute", inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle at center, rgba(200,169,110,0.04) 0%, transparent 70%)",
  },
  heroTitle: { fontSize: "2.4rem", fontWeight: 800, color: "var(--white)", marginBottom: "10px" },
  heroSub: { color: "var(--text-muted)", fontSize: "0.95rem" },
  grid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "56px" },
  successBox: {
    background: "var(--card-bg)", border: "1px solid var(--accent)",
    borderRadius: "8px", padding: "32px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
  },
  infoCard: {
    display: "flex", alignItems: "flex-start", gap: "14px",
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "16px", marginBottom: "10px",
  },
  infoIcon: { color: "var(--accent)", marginTop: "2px", flexShrink: 0 },
  infoLabel: { color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "3px", letterSpacing: "0.3px" },
  infoValue: { color: "var(--white)", fontWeight: 500, fontSize: "0.88rem" },
};
