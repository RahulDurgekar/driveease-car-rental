import StarRating from "./StarRating";

export default function ReviewCard({ review }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>{review.user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <p style={styles.name}>{review.user?.name}</p>
          <p style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <StarRating value={review.rating} size="1rem" />
        </div>
      </div>
      <p style={styles.comment}>{review.comment}</p>
    </div>
  );
}

const styles = {
  card: { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "12px" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-dim)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" },
  name: { fontWeight: 600, fontSize: "0.9rem", color: "var(--white)" },
  date: { fontSize: "0.75rem", color: "var(--text-muted)" },
  comment: { fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.6 },
};
