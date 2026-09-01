import "./Hero.css";
import Header from "./Header";
import Logo from "../assets/logo.png";
import heroImg from "../assets/hero.png";

function Hero() {
  const scrollToSection = (id) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(id);
  };

  return (
    <section id="hero" className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-overlay"></div>
      <Header />

      <div className="hero-logo">
        <img src={Logo} alt="logo" className="logo-img" />
      </div>

      <button onClick={() => scrollToSection("contact")} className="hero-cta-button">
        <span className="cta-text">Let's Connect</span>
        <span className="cta-circle">
          <span className="cta-circle-arrow">-&gt;</span>
        </span>
      </button>

      <div className="hero-content">
        <p className="hero-label">
          <span className="hero-label-line"></span>
          ARCHITECTURAL PORTFOLIO
        </p>
        <h1 className="hero-title">Designing the</h1>
        <div className="hero-title-row">
          <h1 className="hero-title"><em>Future</em></h1>
          <button onClick={() => scrollToSection("projects")} className="hero-button">
            View Projects <span className="cta-arrow">-&gt;</span>
          </button>
        </div>
      </div>
      <p className="hero-blurb">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </section>
  );
}

export default Hero;