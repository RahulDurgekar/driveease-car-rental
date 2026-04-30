import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import PaymentModal from "../components/PaymentModal";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Footer from "../components/Footer";

export default function CarDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [booking, setBooking] = useState({ startDate: "", endDate: "", startTime: "09:00", endTime: "18:00" });
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [bookingMsg, setBookingMsg] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [bookingErr, setBookingErr] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [dateCheckErr, setDateCheckErr] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`).then((r) => setCar(r.data));
    api.get(`/reviews/${id}`).then((r) => setReviews(r.data));

    // Pre-fill dates from URL params if available
    const urlStartDate = searchParams.get("startDate");
    const urlEndDate = searchParams.get("endDate");
    if (urlStartDate && urlEndDate) {
      setBooking((prev) => ({
        ...prev,
        startDate: urlStartDate,
        endDate: urlEndDate,
      }));
    }
  }, [id, searchParams]);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setBookingErr("");
    setBookingMsg("");
    setDateCheckErr("");

    if (!booking.startDate || !booking.endDate) {
      setBookingErr("Please select both start and end dates");
      return;
    }

    // Check availability one more time before opening payment modal
    try {
      const { data } = await api.get("/cars/check/availability", {
        params: {
          carId: id,
          startDate: booking.startDate,
          endDate: booking.endDate,
        },
      });

      if (!data.available) {
        setDateCheckErr("Sorry, this car is no longer available for the selected dates. Please choose different dates.");
        return;
      }
    } catch (err) {
      console.error("Availability check error:", err);
    }

    // Open payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (transactionId) => {
    setProcessingPayment(true);
    try {
      // Create booking with simulated transaction ID
      await api.post("/bookings", {
        carId: id,
        ...booking,
        paymentTransactionId: transactionId,
      });

      setShowPaymentModal(false);
      setBookingMsg(`Booking confirmed! Transaction ID: ${transactionId}. Payment of ₹${totalPrice} has been sent to the car owner. Owner has been notified.`);
      setBooking({ startDate: "", endDate: "", startTime: "09:00", endTime: "18:00" });
    } catch (err) {
      setBookingErr(err.response?.data?.message || "Booking failed after payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setReviewErr("");
    setReviewMsg("");
    try {
      const { data } = await api.post("/reviews", { carId: id, ...review });
      setReviews((prev) => [data, ...prev]);
      setReviewMsg("Review posted successfully.");
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      setReviewErr(err.response?.data?.message || "Failed to post review");
    }
  };

  if (!car) return <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>Loading...</div>;

  const isOwner = user && car.owner?._id === user._id;
  const totalDays = booking.startDate && booking.endDate
    ? Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))
    : 0;
  const totalPrice = totalDays * car.pricePerDay;

  return (
    <>
      <PaymentModal
        isOpen={showPaymentModal}
        amount={totalPrice}
        carTitle={car.title}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        isProcessing={processingPayment}
      />

      <div className="page-container">
        <div style={styles.grid}>
          <div>
            <ImageSlider images={car.images} />
            <div style={styles.metaRow}>
              <span className={`badge ${car.available ? "badge-green" : "badge-red"}`}>
                {car.available ? "Available" : "Unavailable"}
              </span>
              <span style={styles.metaTag}>{car.fuelType}</span>
              <span style={styles.metaTag}>{car.transmission}</span>
              <span style={styles.metaTag}>{car.seats} Seats</span>
            </div>

            <h1 style={styles.carTitle}>{car.title}</h1>
            <p style={styles.carSub}>{car.brand} {car.model} &middot; {car.year} &middot; {car.city}</p>

            <div style={styles.ratingRow}>
              <StarRating value={Math.round(car.averageRating || 0)} size="1rem" />
              <span style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>
                {car.averageRating || 0} &mdash; {car.totalReviews} review{car.totalReviews !== 1 ? "s" : ""}
              </span>
            </div>

            {car.description && <p style={styles.desc}>{car.description}</p>}

            <div style={styles.contactBox}>
              <p style={styles.boxLabel}>Owner Contact & Address</p>
              <p style={styles.contactRow}><span style={styles.contactKey}>Name</span><span>{car.owner?.name}</span></p>
              <p style={styles.contactRow}><span style={styles.contactKey}>Phone</span><span>{car.contactPhone}</span></p>
              <p style={styles.contactRow}><span style={styles.contactKey}>Email</span><span>{car.contactEmail}</span></p>
              {car.owner?.address && (
                <p style={styles.contactRow}><span style={styles.contactKey}>Address</span><span>{car.owner.address}</span></p>
              )}
            </div>
          </div>

          <div>
            <div style={styles.priceBox}>
              <span style={styles.price}>&#8377;{car.pricePerDay}</span>
              <span style={styles.perDay}> / day</span>
            </div>

            {!isOwner && car.available && (
              <div style={styles.bookBox}>
                <p style={styles.boxLabel}>Book This Car</p>
                {booking.startDate && booking.endDate && (
                  <div style={styles.selectedDates}>
                    <p style={styles.dateInfo}>
                      {booking.startDate} to {booking.endDate}
                    </p>
                    <p style={styles.dateInfo}>
                      {totalDays} day{totalDays > 1 ? "s" : ""} &middot; &#8377;{totalPrice}
                    </p>
                  </div>
                )}
                <form onSubmit={handlePaymentClick}>
                  {!booking.startDate || !booking.endDate ? (
                    <div style={styles.twoCol}>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={booking.startDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setBooking({ ...booking, startDate: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={booking.endDate}
                          min={booking.startDate || new Date().toISOString().split("T")[0]}
                          onChange={(e) => setBooking({ ...booking, endDate: e.target.value })} required />
                      </div>
                    </div>
                  ) : (
                    <div style={styles.twoCol}>
                      <div className="form-group">
                        <label>Pick-up Time</label>
                        <input type="time" value={booking.startTime}
                          onChange={(e) => setBooking({ ...booking, startTime: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Drop-off Time</label>
                        <input type="time" value={booking.endTime}
                          onChange={(e) => setBooking({ ...booking, endTime: e.target.value })} required />
                      </div>
                    </div>
                  )}

                  {dateCheckErr && <p className="error-msg">{dateCheckErr}</p>}
                  {bookingErr && <p className="error-msg">{bookingErr}</p>}
                  {bookingMsg && <p className="success-msg">{bookingMsg}</p>}

                  <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                    {user ? "Proceed to Payment" : "Login to Book"}
                  </button>
                </form>
              </div>
            )}

            {isOwner && (
              <div style={styles.ownerNote}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  This is your listing. You cannot book your own car.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "52px" }}>
          <h2 className="section-title">Customer <span>Reviews</span></h2>
          <div className="divider" />

          {user && !isOwner && (
            <div style={styles.reviewForm}>
              <p style={styles.boxLabel}>Write a Review</p>
              <form onSubmit={handleReview}>
                <div className="form-group">
                  <label>Your Rating</label>
                  <StarRating value={review.rating} onChange={(r) => setReview({ ...review, rating: r })} size="1.5rem" />
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea rows={3} placeholder="Share your experience with this car..."
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
                </div>
                {reviewErr && <p className="error-msg">{reviewErr}</p>}
                {reviewMsg && <p className="success-msg">{reviewMsg}</p>}
                <button type="submit" className="btn-primary">Post Review</button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No reviews yet. Be the first to review.</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r._id} review={r} />)
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "start" },
  metaRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px", marginBottom: "14px" },
  metaTag: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "4px", padding: "3px 10px", fontSize: "0.76rem", color: "var(--text-muted)",
  },
  carTitle: { fontSize: "1.7rem", fontWeight: 700, color: "var(--white)", marginBottom: "5px" },
  carSub: { color: "var(--text-muted)", marginBottom: "10px", fontSize: "0.88rem" },
  ratingRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" },
  desc: { color: "var(--text-muted)", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: "20px" },
  contactBox: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "16px", marginTop: "4px",
  },
  boxLabel: { color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" },
  contactRow: { display: "flex", justifyContent: "space-between", fontSize: "0.86rem", color: "var(--text)", marginBottom: "6px" },
  contactKey: { color: "var(--text-muted)", fontSize: "0.82rem" },
  priceBox: {
    background: "var(--accent-dim)", border: "1px solid var(--accent)",
    borderRadius: "8px", padding: "14px 18px",
    display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "14px",
  },
  price: { fontSize: "1.9rem", fontWeight: 800, color: "var(--accent)" },
  perDay: { color: "var(--text-muted)", fontSize: "0.88rem" },
  bookBox: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "20px",
  },
  selectedDates: {
    background: "var(--dark)", borderRadius: "6px", padding: "12px",
    marginBottom: "14px", borderLeft: "3px solid var(--accent)",
  },
  dateInfo: { fontSize: "0.88rem", color: "var(--text)", margin: "4px 0" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  ownerNote: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "16px",
  },
  reviewForm: {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "20px", marginBottom: "20px",
  },
};
