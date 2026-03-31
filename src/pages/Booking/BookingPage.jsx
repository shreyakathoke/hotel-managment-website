import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/booking.css";
import { createBookingApi, cancelBookingApi } from "../../api/api";

function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [form, setForm] = useState({ checkInDate: "", checkOutDate: "" });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("user_email");

  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const n = daysBetween(form.checkInDate, form.checkOutDate);
    return n > 0 ? n : 0;
  }, [form.checkInDate, form.checkOutDate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validate = () => {
    if (!token) return "Please login first.";
    if (!roomId) return "Room ID not found.";
    if (!form.checkInDate) return "Select check-in date.";
    if (!form.checkOutDate) return "Select check-out date.";
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate))
      return "Check-out must be after check-in.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    try {
      const bookingData = {
        roomId,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        userEmail,
      };

      const response = await createBookingApi(bookingData);
      setBooking(response.booking);
      navigate(`/payment/${response.booking.bookingId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async () => {
    if (!booking?.bookingId) return;

    setCanceling(true);
    setError("");

    try {
      const response = await cancelBookingApi(booking.bookingId);
      setBooking((prev) => ({ ...prev, status: "CANCELLED" }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to cancel booking.");
    } finally {
      setCanceling(false);
    }
  };

  const goLogin = () => navigate("/login");

  return (
    <main className="booking-page" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container py-5" style={{ maxWidth: 820 }}>
        <div className="card shadow border-0 booking-card">
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-3">Book Your Room</h2>
            <p className="text-muted">
              Room ID: <b>{roomId}</b>
            </p>

            {!token && (
              <div className="mb-3">
                <button className="btn btn-outline-primary" onClick={goLogin}>
                  Login to Book
                </button>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {token && (
              <form onSubmit={onSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Check-in Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={form.checkInDate}
                      onChange={onChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Check-out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={form.checkOutDate}
                      onChange={onChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <div className="p-3 bg-light border rounded">
                      Nights: <b>{nights}</b>
                    </div>
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/rooms")}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}

            {booking && (
              <div className="mt-4 border-top pt-3">
                <p>
                  <b>Booking ID:</b> {booking.bookingId}
                </p>
                <p>
                  <b>Status:</b> {booking.status}
                </p>

                <button
                  className="btn btn-danger"
                  onClick={onCancel}
                  disabled={canceling || booking.status === "CANCELLED"}
                >
                  {canceling ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}