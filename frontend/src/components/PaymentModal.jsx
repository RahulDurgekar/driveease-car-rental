import { useState } from "react";

export default function PaymentModal({ isOpen, amount, carTitle, onSuccess, onCancel, isProcessing }) {
  const [paymentStep, setPaymentStep] = useState("details"); // details, processing, success

  const handleSimulatePayment = async () => {
    setPaymentStep("processing");
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate simulated transaction ID
    const transactionId = "TXN" + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    setPaymentStep("success");
    
    // Call success callback after showing success screen
    setTimeout(() => {
      onSuccess(transactionId);
      setPaymentStep("details");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {paymentStep === "details" && "Complete Payment"}
            {paymentStep === "processing" && "Processing Payment"}
            {paymentStep === "success" && "Payment Successful"}
          </h3>
          {paymentStep === "details" && (
            <button style={styles.closeBtn} onClick={onCancel} disabled={isProcessing}>✕</button>
          )}
        </div>

        <div style={styles.content}>
          {paymentStep === "details" && (
            <>
              <div style={styles.carInfo}>
                <p style={styles.label}>Car</p>
                <p style={styles.value}>{carTitle}</p>
              </div>

              <div style={styles.amountBox}>
                <p style={styles.label}>Amount to Pay</p>
                <p style={styles.amount}>₹{amount}</p>
              </div>

              <div style={styles.paymentMethodBox}>
                <p style={styles.label}>Payment Method</p>
                <div style={styles.methodOption}>
                  <input type="radio" id="card" name="method" defaultChecked style={styles.radio} />
                  <label htmlFor="card" style={styles.methodLabel}>Credit/Debit Card</label>
                </div>
                <div style={styles.methodOption}>
                  <input type="radio" id="upi" name="method" style={styles.radio} />
                  <label htmlFor="upi" style={styles.methodLabel}>UPI</label>
                </div>
                <div style={styles.methodOption}>
                  <input type="radio" id="wallet" name="method" style={styles.radio} />
                  <label htmlFor="wallet" style={styles.methodLabel}>Digital Wallet</label>
                </div>
              </div>

              <div style={styles.securityNote}>
                <p style={styles.securityText}>
                  This is a just a demonstration. No actual payment will be processed. The payment details will be recorded and sent to the car owner.
                </p>
              </div>

              <button
                style={styles.payBtn}
                onClick={handleSimulatePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Simulate Payment"}
              </button>

              <button
                style={styles.cancelBtn}
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </>
          )}

          {paymentStep === "processing" && (
            <div style={styles.processingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.processingText}>Processing your payment...</p>
              <p style={styles.processingSubtext}>Please wait while we process your booking</p>
            </div>
          )}

          {paymentStep === "success" && (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <p style={styles.successTitle}>Payment Successful!</p>
              <p style={styles.successText}>Your booking has been confirmed</p>
              <div style={styles.successDetails}>
                <p style={styles.detailRow}>
                  <span style={styles.detailLabel}>Amount Paid:</span>
                  <span style={styles.detailValue}>₹{amount}</span>
                </p>
                <p style={styles.detailRow}>
                  <span style={styles.detailLabel}>Car:</span>
                  <span style={styles.detailValue}>{carTitle}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--white)",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: "0",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  },
  content: {
    padding: "24px",
  },
  carInfo: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    margin: "0 0 6px 0",
  },
  value: {
    fontSize: "0.95rem",
    color: "var(--white)",
    margin: 0,
    fontWeight: 500,
  },
  amountBox: {
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },
  amount: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "var(--accent)",
    margin: "8px 0 0 0",
  },
  paymentMethodBox: {
    background: "var(--dark)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  methodOption: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  radio: {
    cursor: "pointer",
    width: "18px",
    height: "18px",
  },
  methodLabel: {
    fontSize: "0.88rem",
    color: "var(--text)",
    cursor: "pointer",
    margin: 0,
  },
  securityNote: {
    background: "rgba(200, 169, 110, 0.1)",
    border: "1px solid rgba(200, 169, 110, 0.3)",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "20px",
  },
  securityText: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    margin: 0,
    lineHeight: 1.5,
  },
  payBtn: {
    width: "100%",
    padding: "12px",
    background: "var(--accent)",
    color: "var(--black)",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "background 0.2s",
  },
  cancelBtn: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  processingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid var(--border)",
    borderTop: "4px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  processingText: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--white)",
    margin: "0 0 8px 0",
    textAlign: "center",
  },
  processingSubtext: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    margin: 0,
    textAlign: "center",
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    textAlign: "center",
  },
  successIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(124, 179, 66, 0.2)",
    border: "2px solid var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "var(--accent)",
    marginBottom: "16px",
  },
  successTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--white)",
    margin: "0 0 8px 0",
  },
  successText: {
    fontSize: "0.88rem",
    color: "var(--text-muted)",
    margin: "0 0 20px 0",
  },
  successDetails: {
    background: "var(--dark)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "16px",
    width: "100%",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.88rem",
    color: "var(--text)",
    margin: "8px 0",
  },
  detailLabel: {
    color: "var(--text-muted)",
  },
  detailValue: {
    fontWeight: 600,
    color: "var(--accent)",
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
