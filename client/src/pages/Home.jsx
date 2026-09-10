import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Career from "../pages/Career";
import Contact from "../pages/Contact";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function Home() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading, location.state]);

  if (loading) {
    return (
      <Loading
        label="ARCHITECTURE & DESIGN"
        titleMain="Gillian"
        titleAccent="Gutierrez"
      />
    );
  }

  return (
    <div className="hero-frame">
      <Hero />
      <About />
      <Projects />
      <Career />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;