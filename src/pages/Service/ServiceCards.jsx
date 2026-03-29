import { useEffect, useRef, useState } from "react";
import "../../styles/serviceCards.css";

const SERVICES = [
  {
    icon: "bi bi-house-door",
    title: "Houseboat Stays",
    desc: "Experience serene backwaters aboard a traditional houseboat, combining comfort with scenic beauty.",
  },
  {
    icon: "bi bi-cup-hot",
    title: "Tea Gardens",
    desc: "Stroll through lush tea plantations and enjoy guided tours of our aromatic gardens.",
  },
  {
    icon: "bi bi-heart-pulse",
    title: "Ayurveda Wellness",
    desc: "Relax and rejuvenate with authentic Ayurvedic therapies designed to balance body and mind.",
  },
  {
    icon: "bi bi-tree",
    title: "Hill Trekking",
    desc: "Embark on adventurous treks through misty hills, discovering hidden trails and breathtaking views.",
  },
];

function ServiceCard({ icon, title, desc, index }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="svc-card svc-animate"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="svc-iconWrap">
          <span className="svc-iconCircle">
            <i className={icon}></i>
          </span>
        </div>

        <h3 className="svc-title">{title}</h3>
        <p className="svc-desc">{desc}</p>
      </div>
    </div>
  );
}

export default function ServiceCards() {
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
    <section
      ref={ref}
      className={`svc-section py-5 ${visible ? "is-visible" : ""}`}
    >
      <div className="container py-3">
        <div className="row g-4">
          {SERVICES.map((s, index) => (
            <ServiceCard key={s.title} index={index} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}