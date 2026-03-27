import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/booking.css";

function toYMD(value) {
  return (value || "").trim();
}

function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const token = localStorage.getItem("token");

  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const n = daysBetween(form.checkInDate, form.checkOutDate);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [form.checkInDate, form.checkOutDate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validate = () => {
    if (!token) return "Please login first.";
    if (!roomId) return "Room ID not found.";
    if (!form.checkInDate) return "Select check-in date.";
    if (!form.checkOutDate) return "Select check-out date.";

    const inD = new Date(form.checkInDate);
    const outD = new Date(form.checkOutDate);

    if (outD <= inD) return "Check-out must be after check-in.";
    return "";
  };

  // ✅ LOCAL BOOKING (NO BACKEND)
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);

    try {
      const bookingId = "BK-" + Date.now();

      const newBooking = {
        bookingId,
        roomId,
        checkInDate: toYMD(form.checkInDate),
        checkOutDate: toYMD(form.checkOutDate),
        userEmail: localStorage.getItem("user_email"),
        status: "CONFIRMED",
      };

      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push(newBooking);

      localStorage.setItem("bookings", JSON.stringify(bookings));

      setBooking(newBooking);

      // ✅ redirect to payment (optional page)
      navigate(`/payment/${bookingId}`, { replace: true });

    } catch (err) {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL BOOKING
  const onCancel = () => {
    if (!booking?.bookingId) return;

    setCanceling(true);

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const updated = bookings.map((b) =>
      b.bookingId === booking.bookingId
        ? { ...b, status: "CANCELLED" }
        : b
    );

    localStorage.setItem("bookings", JSON.stringify(updated));

    setBooking((p) => ({ ...p, status: "CANCELLED" }));

    setCanceling(false);
  };

  const goLogin = () => navigate("/login");

  return (
    <main className="booking-page">
      <div className="container py-5" style={{ maxWidth: 820 }}>
        <div className="card shadow-sm border-0 booking-card">
          <div className="card-body p-4 p-md-5">

            <h2>Book Room</h2>
            <p>Room ID: {roomId}</p>

            {!token && (
              <button className="btn btn-outline-primary" onClick={goLogin}>
                Login to Book
              </button>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label>Check-in</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={form.checkInDate}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label>Check-out</label>
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
                <button className="btn btn-secondary" type="button" onClick={() => navigate("/rooms")}>
                  Back
                </button>

                <button className="btn btn-primary" disabled={!token || loading}>
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>

            {booking && (
              <div className="mt-4">
                <p><b>Booking ID:</b> {booking.bookingId}</p>
                <p><b>Status:</b> {booking.status}</p>

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