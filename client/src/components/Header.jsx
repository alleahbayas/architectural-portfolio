import "./Header.css";
import { useState, useEffect } from "react";
import Logo from "../assets/logo.png";

function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const navItems = [
    { name: "HOME", target: "hero" },
    { name: "ABOUT", target: "about" },
    { name: "PROJECTS", target: "projects" },
    { name: "CONTACT", target: "contact" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.target));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          );
          setActiveSection(mostVisible.target.id);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="header-bar">
      <div className="logo">
        <img src={Logo} alt="logo" className="logo-img" />
        <span className="logo-text">GILLIAN<br />GUTIERREZ</span>
      </div>

      <nav className="nav-pill">
        {navItems.map((item) => (
          <button
            key={item.target}
            onClick={() => scrollToSection(item.target)}
            className={activeSection === item.target ? "nav-link nav-link-active" : "nav-link"}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <button onClick={() => scrollToSection("contact")} className="cta-button">
        <span className="cta-text">Let's Connect</span>
        <span className="cta-circle">
          <span className="cta-arrow">-&gt;</span>
        </span>
      </button>
    </div>
  );
}

export default Header;