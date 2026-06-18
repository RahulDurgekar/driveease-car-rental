export default function BookingConfirmModal({ isOpen, booking, car, onConfirm, onCancel, onEdit }) {
  if (!isOpen) return null;

  const { startDate, endDate, startTime, endTime } = booking;
  const totalDays = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000));
  const totalPrice = totalDays * car.pricePerDay;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Confirm Your Booking</h3>
        <div style={styles.divider} />

        <div style={styles.section}>
          <p style={styles.label}>Car</p>
          <p style={styles.value}>{car.title}</p>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>Pickup</p>
          <p style={styles.value}>
            {new Date(startDate).toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })} at {startTime}
          </p>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>Drop-off</p>
          <p style={styles.value}>
            {new Date(endDate).toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })} at {endTime}
          </p>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>Duration</p>
          <p style={styles.value}>{totalDays} day{totalDays > 1 ? 's' : ''}</p>
        </div>

        <div style={styles.priceSection}>
          <p style={styles.label}>Total Price</p>
          <p style={styles.price}>₹{totalPrice}</p>
        </div>

        <div style={styles.buttons}>
          <button className="btn-outline" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-outline" onClick={onEdit} style={{ flex: 1 }}>
            Edit Times
          </button>
          <button className="btn-primary" onClick={onConfirm} style={{ flex: 1 }}>
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '28px',
    maxWidth: '480px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--white)',
    marginBottom: '8px',
  },
  divider: {
    width: '48px',
    height: '2px',
    background: 'var(--accent)',
    marginBottom: '24px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  section: {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  value: {
    fontSize: '0.95rem',
    color: 'var(--text)',
    fontWeight: 500,
  },
  priceSection: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid var(--accent)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  price: {
    fontSize: '1.8rem',
    color: 'var(--accent)',
    fontWeight: 800,
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
};
