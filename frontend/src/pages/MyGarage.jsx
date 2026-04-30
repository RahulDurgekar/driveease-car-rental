import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function MyGarage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cars/my").then((r) => setCars(r.data)).finally(() => setLoading(false));
  }, []);

  const toggleAvail = async (id) => {
    const { data } = await api.patch(`/cars/${id}/toggle`);
    setCars((prev) => prev.map((c) => c._id === id ? { ...c, available: data.available } : c));
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this car listing?")) return;
    await api.delete(`/cars/${id}`);
    setCars((prev) => prev.filter((c) => c._id !== id));
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="page-container">
      <div style={styles.topRow}>
        <div>
          <h2 className="section-title">My <span>Garage</span></h2>
          <div className="divider" />
        </div>
        <Link to="/post-car"><button className="btn-primary">Post New Car</button></Link>
      </div>

      {cars.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>You haven't posted any cars yet.</p>
          <Link to="/post-car"><button className="btn-primary">Post Your First Car</button></Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {cars.map((car) => (
            <div key={car._id} className="card" style={styles.card}>
              <img
                src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"}
                alt={car.title}
                style={styles.img}
              />
              <div style={styles.body}>
                <h3 style={styles.title}>{car.title}</h3>
                <p style={styles.sub}>{car.brand} {car.model} &middot; {car.year} &middot; {car.city}</p>
                <p style={styles.price}>&#8377;{car.pricePerDay} / day</p>
                <div style={styles.actions}>
                  <button
                    className={car.available ? "btn-outline" : "btn-primary"}
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    onClick={() => toggleAvail(car._id)}
                  >
                    {car.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <Link to={`/cars/${car._id}`}>
                    <button className="btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>View</button>
                  </Link>
                  <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => deleteCar(car._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  card: { display: "flex", flexDirection: "column" },
  img: { width: "100%", height: "175px", objectFit: "cover" },
  body: { padding: "14px", display: "flex", flexDirection: "column", gap: "6px" },
  title: { fontWeight: 600, color: "var(--white)", fontSize: "0.93rem" },
  sub: { color: "var(--text-muted)", fontSize: "0.78rem" },
  price: { color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" },
  empty: { textAlign: "center", padding: "60px 0" },
};
