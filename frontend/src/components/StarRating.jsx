import { useState } from "react";

export default function StarRating({ value = 0, onChange, size = "1.1rem" }) {
  const [hover, setHover] = useState(0);
  const interactive = !!onChange;

  return (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            cursor: interactive ? "pointer" : "default",
            color: star <= (hover || value) ? "var(--accent)" : "var(--border)",
            transition: "color 0.15s",
            lineHeight: 1,
          }}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}
