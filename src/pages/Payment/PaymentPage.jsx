// src/pages/Payment/PaymentPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/payment.css";
import { createPaymentApi, cancelPaymentApi } from "../../api/api"; // backend API

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

  const onPay = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!token) return setError("Please login first.");
    if (!bookingId) return setError("Booking ID missing.");
    if (!canPay) return setError("Enter valid transaction ID.");

    setLoading(true);

    try {
      // call backend API
      const paymentData = {
        bookingId,
        method,
        transactionId: transactionId.trim(),
      };
      const response = await createPaymentApi(paymentData);

      // response from backend
      const newPayment = response.payment || {
        paymentId: "PAY-" + Date.now(),
        bookingId,
        method,
        transactionId: transactionId.trim(),
        amount: response.amount || 5000,
        status: "SUCCESS",
        paidAt: new Date().toLocaleString(),
      };

      setPayment(newPayment);

      // Show success message
      setSuccessMsg("Payment successful ✅");

      // Save locally if needed
      const payments = JSON.parse(localStorage.getItem("payments")) || [];
      payments.push(newPayment);
      localStorage.setItem("payments", JSON.stringify(payments));

      // After 1s show alert then redirect
      setTimeout(() => {
        alert("Payment Successful!");
        navigate("/rooms"); // redirect to rooms
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCancelPayment = async () => {
    if (!payment?.paymentId) return;
    setCanceling(true);
    setError("");

    try {
      await cancelPaymentApi(payment.paymentId);

      setPayment((p) => ({ ...p, status: "CANCELLED" }));
      setSuccessMsg("Payment cancelled ✅");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to cancel payment.");
    } finally {
      setCanceling(false);
    }
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
                        className={`btn w-100 ${method === m.key ? "btn-primary" : "btn-outline-secondary"}`}
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