import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/payment.css";

const METHODS = [
  { key: "UPI", icon: "bi-upc-scan", label: "UPI" },
  { key: "CARD", icon: "bi-credit-card", label: "Card" },
  { key: "NETBANKING", icon: "bi-bank", label: "Net Banking" },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const token = localStorage.getItem("token");

  const [method, setMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [payment, setPayment] = useState(null);

  const canPay = useMemo(() => {
    return Boolean(bookingId && method && transactionId.trim().length >= 6);
  }, [bookingId, method, transactionId]);

  // ✅ LOCAL PAYMENT (NO BACKEND)
  const onPay = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!token) return setError("Please login first.");
    if (!bookingId) return setError("Booking ID missing.");
    if (!canPay) return setError("Enter valid transaction ID.");

    setLoading(true);

    try {
      const paymentId = "PAY-" + Date.now();

      const newPayment = {
        paymentId,
        bookingId,
        method,
        transactionId: transactionId.trim(),
        amount: 5000, // demo amount
        status: "SUCCESS",
        paidAt: new Date().toLocaleString(),
      };

      // Save payment
      const payments = JSON.parse(localStorage.getItem("payments")) || [];
      payments.push(newPayment);
      localStorage.setItem("payments", JSON.stringify(payments));

      // Update booking status
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const updatedBookings = bookings.map((b) =>
        b.bookingId === bookingId ? { ...b, paymentStatus: "PAID" } : b
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      setPayment(newPayment);
      setSuccessMsg("Payment successful ✅");
    } catch (err) {
      setError("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL PAYMENT
  const onCancelPayment = () => {
    if (!payment?.paymentId) return;

    setCanceling(true);

    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    const updated = payments.map((p) =>
      p.paymentId === payment.paymentId
        ? { ...p, status: "CANCELLED" }
        : p
    );

    localStorage.setItem("payments", JSON.stringify(updated));

    setPayment((p) => ({ ...p, status: "CANCELLED" }));

    setSuccessMsg("Payment cancelled ✅");
    setCanceling(false);
  };

  return (
    <main className="pay-page">
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-lg-7">
            <div className="card pay-card p-4">
              <h2>Payment</h2>
              <p>Booking ID: <b>{bookingId}</b></p>

              {!token && (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}

              {error && <div className="alert alert-danger">{error}</div>}
              {successMsg && <div className="alert alert-success">{successMsg}</div>}

              <form onSubmit={onPay}>
                <label className="form-label">Payment Method</label>
                <div className="row mb-3">
                  {METHODS.map((m) => (
                    <div key={m.key} className="col-md-4">
                      <button
                        type="button"
                        className={`btn w-100 ${
                          method === m.key ? "btn-primary" : "btn-outline-secondary"
                        }`}
                        onClick={() => setMethod(m.key)}
                      >
                        {m.label}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label>Transaction ID</label>
                  <input
                    className="form-control"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/rooms")}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!token || loading || !canPay}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-5">
            <div className="card p-4">
              <h5>Summary</h5>

              <p>Booking: {bookingId}</p>
              <p>Method: {method}</p>
              <p>Txn: {transactionId || "-"}</p>

              <hr />

              {!payment ? (
                <p>No payment yet</p>
              ) : (
                <>
                  <p>ID: {payment.paymentId}</p>
                  <p>Amount: ₹{payment.amount}</p>
                  <p>Status: {payment.status}</p>
                  <p>Date: {payment.paidAt}</p>

                  <button
                    className="btn btn-danger"
                    onClick={onCancelPayment}
                    disabled={canceling || payment.status === "CANCELLED"}
                  >
                    {canceling ? "Cancelling..." : "Cancel Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}