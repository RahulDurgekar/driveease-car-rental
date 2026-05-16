import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my").then((r) => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200";
    if (image.startsWith("data:") || image.startsWith("http")) return image;
    return `http://localhost:5050${image}`;
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await api.patch(`/bookings/${id}/status`, { status: "cancelled" });
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="page-container">
      <h2 className="section-title">My <span>Bookings</span></h2>
      <div className="divider" />

      {bookings.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>You haven't made any bookings yet.</p>
          <Link to="/cars"><button className="btn-primary">Browse Cars</button></Link>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((b) => (
            <div key={b._id} style={styles.card}>
              <img
                src={getImageUrl(b.car?.images?.[0])}
                alt=""
                style={styles.img}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200";
                }}
              />
              <div style={styles.info}>
                <h3 style={styles.carName}>{b.car?.title}</h3>
                <p style={styles.meta}>{b.car?.brand} &middot; {b.car?.city}</p>
                <p style={styles.dates}>
                  {new Date(b.startDate).toLocaleDateString()} {b.startTime}
                  &nbsp;&rarr;&nbsp;
                  {new Date(b.endDate).toLocaleDateString()} {b.endTime}
                </p>
                <p style={styles.price}>&#8377;{b.totalPrice} &middot; {b.totalDays} day{b.totalDays > 1 ? "s" : ""}</p>
                <div style={styles.contactRow}>
                  <span style={styles.contactItem}>{b.car?.contactPhone}</span>
                  <span style={styles.contactItem}>{b.car?.contactEmail}</span>
                </div>
                {b.owner?.address && (
                  <p style={styles.ownerAddress}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Pickup Address:</span>
                    <br />
                    <span style={{ fontSize: "0.82rem" }}>{b.owner.address}</span>
                  </p>
                )}
                <p style={styles.transactionId}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Transaction ID:</span>
                  <br />
                  <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--accent)" }}>
                    {b.paymentTransactionId}
                  </span>
                </p>
              </div>
              <div style={styles.right}>
                <span className={`badge ${b.status === "confirmed" ? "badge-green" : b.status === "cancelled" ? "badge-red" : "badge-yellow"}`}>
                  {b.status}
                </span>
                <Link to={`/cars/${b.car?._id}`}>
                  <button className="btn-outline" style={{ padding: "6px 14px", fontSize: "0.8rem", marginTop: "10px" }}>
                    View Car
                  </button>
                </Link>
                {b.status === "pending" && (
                  <button
                    className="btn-danger"
                    style={{ padding: "6px 14px", fontSize: "0.8rem", marginTop: "8px" }}
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", display: "flex", gap: "0", overflow: "hidden",
  },
  img: { width: "155px", height: "115px", objectFit: "cover", flexShrink: 0 },
  info: { flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" },
  carName: { fontWeight: 600, color: "var(--white)", fontSize: "0.95rem" },
  meta: { color: "var(--text-muted)", fontSize: "0.8rem" },
  dates: { color: "var(--text-muted)", fontSize: "0.8rem" },
  price: { color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem" },
  contactRow: { display: "flex", gap: "16px", marginTop: "2px" },
  contactItem: { color: "var(--text-muted)", fontSize: "0.76rem" },
  ownerAddress: { fontSize: "0.8rem", marginTop: "6px", paddingTop: "6px", borderTop: "1px solid var(--border)" },
  transactionId: { fontSize: "0.8rem", marginTop: "6px", paddingTop: "6px", borderTop: "1px solid var(--border)" },
  right: { padding: "14px", display: "flex", flexDirection: "column", alignItems: "flex-end" },
  empty: { textAlign: "center", padding: "60px 0" },
};
