import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.get("/bookings/notifications/count")
        .then((r) => setNotifCount(r.data.count))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>DriveEase</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/cars" style={styles.link}>Browse Cars</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>

      <div style={styles.actions}>
        {user ? (
          <>
            <Link
              to="/notifications"
              style={styles.notifBtn}
              onClick={() => {
                setNotifCount(0);
                api.patch("/bookings/notifications/seen").catch(() => {});
              }}
              aria-label="Notifications"
            >
              <BellIcon />
              {notifCount > 0 && <span style={styles.notifBadge}>{notifCount}</span>}
            </Link>

            <div style={styles.dropdown}>
              <button style={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith("http") || user.avatar.startsWith("data:") ? user.avatar : `http://localhost:5050${user.avatar}`} 
                    alt="Avatar" 
                    style={styles.avatarImg} 
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </button>
              {menuOpen && (
                <div style={styles.dropMenu}>
                  <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/my-garage" style={styles.dropItem} onClick={() => setMenuOpen(false)}>My Garage</Link>
                  <Link to="/my-bookings" style={styles.dropItem} onClick={() => setMenuOpen(false)}>My Bookings</Link>
                  <Link to="/post-car" style={styles.dropItem} onClick={() => setMenuOpen(false)}>Post a Car</Link>
                  <div style={styles.dropDivider} />
                  <button style={styles.dropLogout} onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn-outline" style={{ padding: "7px 18px" }}>Login</button></Link>
            <Link to="/signup"><button className="btn-primary" style={{ padding: "7px 18px" }}>Sign Up</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "62px",
    background: "rgba(20,20,20,0.97)", backdropFilter: "blur(10px)",
    borderBottom: "1px solid var(--border)",
  },
  logo: { fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.3px" },
  links: { display: "flex", gap: "32px" },
  link: { color: "var(--text-muted)", fontSize: "0.88rem", fontWeight: 500, transition: "color 0.2s" },
  actions: { display: "flex", alignItems: "center", gap: "14px" },
  notifBtn: {
    position: "relative", color: "var(--text-muted)", cursor: "pointer",
    display: "flex", alignItems: "center", transition: "color 0.2s",
  },
  notifBadge: {
    position: "absolute", top: "-5px", right: "-7px",
    background: "var(--accent)", color: "var(--black)",
    borderRadius: "50%", width: "16px", height: "16px",
    fontSize: "0.6rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  avatarBtn: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "var(--accent)", color: "var(--black)",
    border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  dropdown: { position: "relative" },
  dropMenu: {
    position: "absolute", top: "42px", right: 0,
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", minWidth: "168px", overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  dropItem: {
    display: "block", padding: "10px 16px",
    color: "var(--text)", fontSize: "0.86rem",
    transition: "background 0.15s",
  },
  dropDivider: { height: "1px", background: "var(--border)", margin: "2px 0" },
  dropLogout: {
    display: "block", width: "100%", padding: "10px 16px",
    background: "none", border: "none", color: "#c97070",
    fontSize: "0.86rem", textAlign: "left", cursor: "pointer",
  },
};
