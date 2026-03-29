import { useEffect, useRef, useState } from "react";
import "../../styles/amazingServices.css";

const SERVICES = [
  { icon: "bi-cup-straw", title: "Pool Beachbar" },
  { icon: "bi-water", title: "Infinity Pool" },
  { icon: "bi-umbrella", title: "Sunbeds" },
];

function ServiceMiniCard({ icon, title, index }) {
  return (
    <div className="col-12 col-sm-4">
      <div className="as-card as-card-animate" style={{ animationDelay: `${index * 120}ms` }}>
        <div className="as-icon">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </div>
        <div className="as-cardTitle">{title}</div>
      </div>
    </div>
  );
}

export default function AmazingServices() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // animate once
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`as-section ${inView ? "is-visible" : ""}`}>
      <div className="container py-5">
        <div className="row align-items-center gy-5">
          {/* LEFT SIDE */}
          <div className="col-12 col-lg-6">
            <div className="as-kicker"></div>

            <h2 className="as-title">Amazing Services</h2>

            <p className="as-text">
                At Hotel Elite, we offer exceptional services to make your stay truly memorable.
                From personalized concierge support to 24/7 room service, every detail is crafted for your comfort.
                Enjoy luxurious amenities, seamless check-in, and attentive staff ready to cater to your needs.
                Our goal is to provide an effortless and enjoyable experience for every guest.

            </p>

            <button type="button" className="as-btn">
              Read More
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-12 col-lg-6">
            <div className="row g-4 justify-content-lg-end">
              {SERVICES.map((s, index) => (
                <ServiceMiniCard key={s.title} index={index} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}