import { useState } from "react";

export default function ImageSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const list = images.length ? images : ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"];

  return (
    <div style={styles.wrapper}>
      <img src={list[current]} alt="car" style={styles.img} />
      {list.length > 1 && (
        <>
          <button
            style={{ ...styles.arrow, left: "12px" }}
            onClick={() => setCurrent((c) => (c - 1 + list.length) % list.length)}
          >
            &#8249;
          </button>
          <button
            style={{ ...styles.arrow, right: "12px" }}
            onClick={() => setCurrent((c) => (c + 1) % list.length)}
          >
            &#8250;
          </button>
          <div style={styles.dots}>
            {list.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  ...styles.dot,
                  background: i === current ? "var(--accent)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: "relative", borderRadius: "8px", overflow: "hidden", background: "var(--card-bg)" },
  img: { width: "100%", height: "370px", objectFit: "cover", display: "block" },
  arrow: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.55)", color: "var(--white)", border: "none",
    borderRadius: "50%", width: "38px", height: "38px", fontSize: "1.5rem",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
  },
  dots: {
    position: "absolute", bottom: "12px", left: "50%",
    transform: "translateX(-50%)", display: "flex", gap: "6px",
  },
  dot: { width: "7px", height: "7px", borderRadius: "50%", cursor: "pointer", transition: "background 0.2s" },
};
