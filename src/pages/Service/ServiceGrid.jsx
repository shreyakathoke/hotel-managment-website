import { useEffect, useRef, useState } from "react";
import "../../styles/serviceGrid.css";

const ITEMS = [
  { icon: "bi-bicycle", title: "Bike Rentals", desc: "Explore the scenic surroundings at your own pace with our convenient bike rental service." },
  { icon: "bi-water", title: "Boat Trips", desc: "Enjoy guided boat trips across tranquil waters, perfect for sightseeing and relaxation." },
  { icon: "bi-shop", title: "Restaurants", desc: "Savor a variety of gourmet dishes at our in-house restaurants, offering local and international cuisine." },
  { icon: "bi-umbrella", title: "Massages", desc: "Relax and rejuvenate with professional massages and spa treatments in a serene environment." },
  { icon: "bi-ticket-perforated", title: "Event Tickets", desc: "Get easy access to local events, concerts, and cultural experiences through our ticketing service." },
  { icon: "bi-signpost-split", title: "Hiking", desc: "Discover breathtaking trails and nature walks with guided hiking tours around the area." },
];

function ServiceItem({ icon, title, desc, index }) {
  return (
    <div className="col-12 col-md-4">
      <div className="sg-item sg-animate" style={{ animationDelay: `${index * 120}ms` }}>
        <div className="sg-icon">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </div>

        <h3 className="sg-title">{title}</h3>

        <p className="sg-text">{desc}</p>
      </div>
    </div>
  );
}

export default function ServiceGrid() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`sg-section py-5 ${visible ? "is-visible" : ""}`}>
      <div className="container py-4">
        <div className="row g-5">
          {ITEMS.map((it, index) => (
            <ServiceItem key={it.title} index={index} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}