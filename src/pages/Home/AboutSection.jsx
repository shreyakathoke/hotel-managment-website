import { useNavigate } from "react-router-dom";
import "../../styles/aboutSection.css";
import img4 from "../../assets/image1.jpg";
import img5 from "../../assets/image2.jpg";
import img3 from "../../assets/g3.jpg";

export default function AboutSection() {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/about"); // 🔥 Redirect to login page
  };

  return (
    <section className="about-sec text-center">
      <div className="container py-5">
        <div className="row align-items-center g-5">

          {/* LEFT CONTENT */}
          <div className="col-12 col-lg-6">

            <div className="about-topline mx-auto" />

            <h2 className="about-title">
              A place to remember
            </h2>

            <p className="about-para">
              Hotel Elite is a luxurious destination that combines comfort and elegance for every guest. It offers spacious rooms with modern amenities, ensuring a relaxing stay. The hotel features fine dining restaurants serving both local and international cuisine. Guests can enjoy recreational facilities like a swimming pool, spa, and fitness center. Its strategic location provides easy access to city attractions and business hubs. With exceptional service and attention to detail, Hotel Elite promises a memorable experience for travelers.
            </p>

            <div className="about-list mt-4 d-flex flex-column align-items-center">
              <div className="about-item">
                <span className="about-check">✓</span>
                <span>Relax in elegant rooms designed to make your stay unforgettable.</span>
              </div>

              <div className="about-item">
                <span className="about-check">✓</span>
                <span>Enjoy world-class dining experiences with a variety of culinary options.</span>
              </div>
            </div>

            <button
              className="about-btn mt-5"
              onClick={handleReadMore}
            >
              Read More
            </button>
          </div>

          {/* RIGHT COLLAGE */}
          <div className="col-12 col-lg-6">
            <div className="about-collage">
              <img className="img-main" src={img4} alt="" />
              <img className="img-top" src={img5} alt="" />
              <img className="img-bottom" src={img3} alt="" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
