import "./Header.css";
import { useState, useEffect, useRef } from "react";

function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef({});

  const navItems = [
    { name: "HOME", target: "hero" },
    { name: "ABOUT", target: "about" },
    { name: "PROJECTS", target: "projects" },
    { name: "CAREER", target: "career" },
  ];

  const scrollToSection = (id) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(id);
  };

  useEffect(() => {
    const activeEl = navRefs.current[activeSection];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.target));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
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
      <div className="nav-pill-backdrop">
        <nav className="nav-pill">
          <div className="nav-indicator" style={indicatorStyle}></div>
          {navItems.map((item) => (
            <button
              key={item.target}
              ref={(el) => (navRefs.current[item.target] = el)}
              onClick={() => scrollToSection(item.target)}
              className={activeSection === item.target ? "nav-link nav-link-active" : "nav-link"}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Header;