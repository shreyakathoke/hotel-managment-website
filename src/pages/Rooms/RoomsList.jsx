import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/roomListPage.css";

// ✅ local images
import room1 from "../../assets/room1.jpg";
import g3 from "../../assets/g3.jpg";
import g4 from "../../assets/g4.jpg";
import g6 from "../../assets/g6.jpg";

const FILTERS = ["All", "Deluxe", "Suite", "Standard", "Single", "Family", "Luxury"];

const formatUSD = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function RoomsList() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeRoom, setActiveRoom] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  // ✅ LOCAL ROOMS DATA (NO BACKEND)
  useEffect(() => {
    const localRooms = [
      {
        roomId: "R1",
        roomNumber: "101",
        type: "Deluxe",
        pricePerNight: 3000,
        capacity: 2,
        available: true,
        cover: room1,
        images: [room1, g3, g4],
        description: "Luxury deluxe room with sea view.",
        features: ["Wi-Fi", "AC", "Breakfast"],
        rating: 4.5,
      },
      {
        roomId: "R2",
        roomNumber: "102",
        type: "Suite",
        pricePerNight: 5000,
        capacity: 4,
        available: true,
        cover: g3,
        images: [g3, g4, g6],
        description: "Spacious suite for family stay.",
        features: ["Wi-Fi", "AC", "Room Service"],
        rating: 4.8,
      },
      {
        roomId: "R3",
        roomNumber: "103",
        type: "Standard",
        pricePerNight: 2000,
        capacity: 2,
        available: false,
        cover: g4,
        images: [g4, g6, room1],
        description: "Comfortable standard room.",
        features: ["Wi-Fi", "Fan"],
        rating: 4.2,
      },
    ];

    setRooms(localRooms);
    setLoading(false);
  }, []);

  const filteredRooms = useMemo(() => {
    const q = query.toLowerCase();
    const f = activeFilter.toLowerCase();

    return rooms.filter((r) => {
      const filterOk = activeFilter === "All" || r.type.toLowerCase().includes(f);
      const queryOk =
        !q ||
        `${r.roomNumber} ${r.type} ${r.available ? "available" : "unavailable"}`
          .toLowerCase()
          .includes(q);

      return filterOk && queryOk;
    });
  }, [rooms, query, activeFilter]);

  const handleBooking = (room) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/booking/${room.roomId}`);
  };

  return (
    <main className="rl-page">
      <section className="rl-hero text-center">
        <h1>Room List</h1>

        <input
          className="form-control mt-3"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="mt-3">
          {FILTERS.map((f) => (
            <button
              key={f}
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
                <div className="card">
                  <img src={room.cover} className="card-img-top" />

                  <div className="card-body">
                    <h5>{room.type}</h5>
                    <p>Room: {room.roomNumber}</p>
                    <p>Price: ₹{room.pricePerNight}</p>
                    <p>{room.available ? "Available" : "Not Available"}</p>

                    <button
                      className="btn btn-primary"
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