import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Notification() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/owner")
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
    api.patch("/bookings/notifications/seen").catch(() => {});
  }, []);

  if (loading) return <p style={{ color: "var(--text-muted)", padding: "40px 24px" }}>Loading...</p>;

  return (
    <div className="page-container">
      <h2 className="section-title">Booking <span>Requests</span></h2>
      <div className="divider" />
      {bookings.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No booking requests yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <p style={styles.carName}>{b.car?.title} &mdash; {b.car?.brand} {b.car?.model}</p>
                <p style={styles.detail}>
                  Booked by <strong style={{ color: "var(--white)" }}>{b.renter?.name}</strong>
                  &nbsp;&middot;&nbsp;{b.renter?.email}
                  {b.renter?.phone && <>&nbsp;&middot;&nbsp;{b.renter?.phone}</>}
                </p>
                <p style={styles.detail}>
                  {new Date(b.startDate).toLocaleDateString()} {b.startTime}
                  &nbsp;&rarr;&nbsp;
                  {new Date(b.endDate).toLocaleDateString()} {b.endTime}
                </p>
                <p style={styles.price}>Total: &#8377;{b.totalPrice} &middot; {b.totalDays} day{b.totalDays > 1 ? "s" : ""}</p>
                <p style={styles.transactionId}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Transaction ID:</span>
                  <br />
                  <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--accent)" }}>
                    {b.paymentTransactionId}
                  </span>
                </p>
              </div>
              <span className={`badge ${b.status === "confirmed" ? "badge-green" : b.status === "cancelled" ? "badge-red" : "badge-yellow"}`}>
                {b.status}
              </span>
            </div>
            {b.status === "pending" && (
              <div style={styles.actions}>
                <button className="btn-primary" style={{ padding: "6px 16px", fontSize: "0.84rem" }}
                  onClick={() => updateStatus(b._id, "confirmed", setBookings)}>
                  Confirm
                </button>
                <button className="btn-danger" style={{ padding: "6px 16px", fontSize: "0.84rem" }}
                  onClick={() => updateStatus(b._id, "cancelled", setBookings)}>
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

async function updateStatus(id, status, setBookings) {
  await api.patch(`/bookings/${id}/status`, { status });
  setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
}

const styles = {
  card: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "18px", marginBottom: "12px",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  carName: { fontWeight: 600, color: "var(--white)", marginBottom: "5px", fontSize: "0.95rem" },
  detail: { fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: "3px" },
  price: { fontSize: "0.88rem", color: "var(--accent)", fontWeight: 600, marginTop: "4px" },
  transactionId: { fontSize: "0.82rem", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" },
  actions: { display: "flex", gap: "10px" },
};
