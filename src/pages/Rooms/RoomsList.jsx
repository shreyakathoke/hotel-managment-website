// src/pages/Rooms/RoomsList.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/roomListPage.css";

import { getRoomsApi } from "../../api/api";

// Fallback images
import room1 from "../../assets/room1.jpg";
import room2 from "../../assets/g6.jpg";
import secondroom from "../../assets/g14.jpg";
import thirdroom from "../../assets/g3.jpg";
import room5 from "../../assets/g4.jpg";
import room6 from "../../assets/g6.jpg";

const FILTERS = ["All", "Deluxe", "Suite", "Standard", "Single", "Family", "Luxury"];

export default function RoomsList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRoomsApi();
        const fallbackImages = [room1, room2, secondroom, thirdroom, room5, room6];

        const formattedRooms = data.map((r, idx) => {
          const imageUrl =
            r.imageUrl && r.imageUrl.startsWith("http")
              ? r.imageUrl
              : fallbackImages[idx % fallbackImages.length];

          return {
            ...r,
            cover: imageUrl,
            images: [imageUrl, room2, secondroom, thirdroom],
            features: ["Wi-Fi", "AC", "Breakfast", "TV"],
            rating: 4.5,
          };
        });

        setRooms(formattedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    const q = query.toLowerCase();
    const f = activeFilter.toLowerCase();

    return rooms.filter((r) => {
      const filterOk = activeFilter === "All" || r.type.toLowerCase().includes(f);
      const queryOk =
        !q ||
        `${r.roomNumber} ${r.type} ${r.available ? "available" : "unavailable"}`.toLowerCase().includes(q);
      return filterOk && queryOk;
    });
  }, [rooms, query, activeFilter]);

  const handleBooking = (room) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login with "from" state
      navigate("/login", { state: { from: `/booking/${room.roomId}` } });
      return;
    }
    navigate(`/booking/${room.roomId}`);
  };

  return (
    <main className="rl-page" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <section className="rl-hero text-center py-5">
        <h1 className="text-dark">Room List</h1>

        <input
          className="form-control mt-3"
          placeholder="Search rooms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: "400px", margin: "10px auto" }}
        />

        <div className="mt-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`btn m-1 ${activeFilter === f ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="container py-5">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="row g-4">
            {filteredRooms.map((room) => (
              <div key={room.roomId} className="col-md-4">
                <div className="card h-100 shadow-sm" data-aos="fade-up">
                  <img
                    src={room.cover}
                    className="card-img-top"
                    alt="room"
                    onError={(e) => {
                      const fallbackImages = [room1, room2, secondroom, thirdroom, room5, room6];
                      e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                    }}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5>{room.type} Room</h5>
                    <p className="mb-1">Room: {room.roomNumber}</p>
                    <p className="mb-1">Price: ₹{room.pricePerNight}</p>
                    <p className="mb-2">{room.available ? "Available" : "Not Available"}</p>

                    <div className="mb-2">
                      {room.features.map((f, idx) => (
                        <span key={idx} className="badge bg-secondary me-1">
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="mb-2">
                      <span className="text-warning">
                        {"★".repeat(Math.floor(room.rating))}
                        {"☆".repeat(5 - Math.floor(room.rating))}
                      </span>
                      <span className="ms-2">{room.rating.toFixed(1)}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary mt-auto"
                      disabled={!room.available}
                      onClick={() => handleBooking(room)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}