import "./Header.css";
import { useState, useEffect, useRef } from "react";

function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef({});

  const intersectingIds = useRef(new Set());
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimeout = useRef(null);

  const navItems = [
    { name: "HOME", target: "hero" },
    { name: "ABOUT", target: "about" },
    { name: "PROJECTS", target: "projects" },
    { name: "CAREER", target: "career" },
  ];

  const scrollToSection = (id) => {
    isProgrammaticScroll.current = true;
    setActiveSection(id);

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    clearTimeout(scrollEndTimeout.current);
    const clear = () => {
      isProgrammaticScroll.current = false;
      window.removeEventListener("scrollend", clear);
    };
    window.addEventListener("scrollend", clear, { once: true });
    scrollEndTimeout.current = setTimeout(clear, 1000);
  };

  useEffect(() => {
    if (!activeSection) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const activeEl = navRefs.current[activeSection];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.target));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.current.add(entry.target.id);
          } else {
            intersectingIds.current.delete(entry.target.id);
          }
        });

        if (isProgrammaticScroll.current) return;

        const found = navItems.find((item) =>
          intersectingIds.current.has(item.target)
        );
        setActiveSection(found ? found.target : null);
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
      clearTimeout(scrollEndTimeout.current);
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
              className={
                activeSection === item.target
                  ? "nav-link nav-link-active"
                  : "nav-link"
              }
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