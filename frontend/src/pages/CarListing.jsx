import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import api from "../utils/api";
import Footer from "../components/Footer";

export default function CarListing() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [filterCity, setFilterCity] = useState(searchParams.get("city") || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  useEffect(() => {
    fetchCars();
  }, [filterCity, selectedStartDate, selectedEndDate]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCity) params.set("city", filterCity);
      if (selectedStartDate) params.set("startDate", selectedStartDate);
      if (selectedEndDate) params.set("endDate", selectedEndDate);

      const { data } = await api.get(`/cars?${params}`);
      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilterCity(city);
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  const handleClear = () => {
    setCity("");
    setFilterCity("");
    setStartDate("");
    setEndDate("");
    setSelectedStartDate("");
    setSelectedEndDate("");
  };

  return (
    <>
      <div style={styles.header}>
        <div style={styles.overlay} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={styles.title}>Browse <span style={{ color: "var(--accent)" }}>Cars</span></h1>
          <p style={styles.sub}>Find the perfect car for your next trip</p>
        </div>
      </div>

      <div className="page-container">
        <div style={styles.filterSection}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>City</label>
              <input
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Start Date</label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterActions}>
              <button className="btn-primary" onClick={handleSearch}>Search</button>
              {(filterCity || selectedStartDate || selectedEndDate) && (
                <button className="btn-outline" onClick={handleClear}>Clear</button>
              )}
            </div>
          </div>
          <span style={styles.count}>
            {cars.length} car{cars.length !== 1 ? "s" : ""} available
            {selectedStartDate && selectedEndDate && ` from ${selectedStartDate} to ${selectedEndDate}`}
          </span>
        </div>

        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : cars.length === 0 ? (
          <div style={styles.center}>
            <p>
              No cars available
              {filterCity ? ` in "${filterCity}"` : ""}
              {selectedStartDate && selectedEndDate ? ` for ${selectedStartDate} to ${selectedEndDate}` : ""}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

const styles = {
  header: {
    height: "210px",
    background: "linear-gradient(135deg, var(--dark) 0%, var(--bg) 100%)",
    display: "flex", alignItems: "center", padding: "0 48px",
    position: "relative", borderBottom: "1px solid var(--border)",
  },
  overlay: {
    position: "absolute", inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle at 20% 50%, rgba(200,169,110,0.05) 0%, transparent 60%)",
  },
  title: { fontSize: "2.2rem", fontWeight: 800, color: "var(--white)", marginBottom: "6px" },
  sub: { color: "var(--text-muted)", fontSize: "0.9rem" },
  filterSection: { marginBottom: "32px" },
  filterRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "12px" },
  filterGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  filterLabel: { fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" },
  filterInput: { height: "40px" },
  filterActions: { display: "flex", gap: "8px", alignItems: "flex-end" },
  count: { color: "var(--text-muted)", fontSize: "0.85rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "22px" },
  center: { textAlign: "center", color: "var(--text-muted)", padding: "60px 0" },
};
