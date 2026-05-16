import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function CarCard({ car, selectedStartDate, selectedEndDate }) {
  const getImageUrl = (image) => {
    console.log('CarCard - Original image:', image);
    if (!image) {
      console.log('CarCard - No image, using default');
      return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600";
    }
    // If it's already a data URL (base64) or external URL, use as is
    if (image.startsWith("data:") || image.startsWith("http")) {
      console.log('CarCard - Using image as is:', image.substring(0, 50));
      return image;
    }
    // If it's a file path, prepend backend URL
    const fullUrl = `http://localhost:5050${image}`;
    console.log('CarCard - Full URL:', fullUrl);
    return fullUrl;
  };

  const img = getImageUrl(car.images?.[0]);
  console.log('CarCard - Final img src:', img);

  const detailUrl = selectedStartDate && selectedEndDate
    ? `/cars/${car._id}?startDate=${selectedStartDate}&endDate=${selectedEndDate}`
    : `/cars/${car._id}`;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.imgWrap}>
        <img 
          src={img} 
          alt={car.title} 
          style={styles.img}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600";
          }}
        />
        <span className={`badge ${car.available ? "badge-green" : "badge-red"}`} style={styles.badge}>
          {car.available ? "Available" : "Unavailable"}
        </span>
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{car.title}</h3>
        <p style={styles.sub}>{car.brand} {car.model} &middot; {car.year}</p>

        <div style={styles.row}>
          <StarRating value={Math.round(car.averageRating || 0)} size="0.9rem" />
          <span style={styles.reviews}>({car.totalReviews || 0} reviews)</span>
        </div>

        <div style={styles.meta}>
          <span style={styles.metaItem}>{car.city}</span>
          <span style={styles.metaDot} />
          <span style={styles.metaItem}>{car.fuelType}</span>
          <span style={styles.metaDot} />
          <span style={styles.metaItem}>{car.transmission}</span>
          <span style={styles.metaDot} />
          <span style={styles.metaItem}>{car.seats} seats</span>
        </div>

        <div style={styles.contact}>
          <span style={styles.contactItem}>{car.contactPhone}</span>
          <span style={styles.contactItem}>{car.contactEmail}</span>
        </div>

        <div style={styles.footer}>
          <div>
            <span style={styles.price}>&#8377;{car.pricePerDay}</span>
            <span style={styles.perDay}> / day</span>
          </div>
          <Link to={detailUrl}>
            <button className="btn-primary" style={{ padding: "7px 18px", fontSize: "0.84rem" }}>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { display: "flex", flexDirection: "column" },
  imgWrap: { position: "relative", background: "var(--dark)" },
  img: { width: "100%", height: "196px", objectFit: "cover", display: "block" },
  badge: { position: "absolute", top: "10px", right: "10px" },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  title: { fontSize: "0.97rem", fontWeight: 600, color: "var(--white)" },
  sub: { fontSize: "0.8rem", color: "var(--text-muted)" },
  row: { display: "flex", alignItems: "center", gap: "6px" },
  reviews: { fontSize: "0.76rem", color: "var(--text-muted)" },
  meta: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text-muted)" },
  metaItem: {},
  metaDot: { width: "3px", height: "3px", borderRadius: "50%", background: "var(--border)", display: "inline-block" },
  contact: {
    display: "flex", flexDirection: "column", gap: "2px",
    fontSize: "0.76rem", color: "var(--text-muted)",
    borderTop: "1px solid var(--border)", paddingTop: "8px",
  },
  contactItem: {},
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px" },
  price: { fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" },
  perDay: { fontSize: "0.78rem", color: "var(--text-muted)" },
};
