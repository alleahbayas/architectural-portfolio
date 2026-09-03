import "./Header.css";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRefs = useRef({});

  const intersectingIds = useRef(new Set());
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimeout = useRef(null);

  const navItems = [
    { name: "HOME", target: "hero" },
    { name: "ABOUT", target: "about" },
    { name: "PROJECTS", target: "projects" },
    { name: "CAREER", target: "career" },
    { name: "CONTACT", target: "contact" },
  ];

  const scrollToSection = (id) => {
    isProgrammaticScroll.current = true;
    setActiveSection(id);
    setIsMenuOpen(false);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
                (activeSection === item.target
                  ? "nav-link nav-link-active"
                  : "nav-link") +
                (item.target === "contact" ? " nav-link-desktop-hide" : "")
              }
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div
        className={isMenuOpen ? "mobile-drawer mobile-drawer-open" : "mobile-drawer"}
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand">G. GUTIERREZ</span>
          <button
            className="mobile-drawer-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => scrollToSection(item.target)}
              className={
                activeSection === item.target
                  ? "mobile-drawer-link mobile-drawer-link-active"
                  : "mobile-drawer-link"
              }
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Header;