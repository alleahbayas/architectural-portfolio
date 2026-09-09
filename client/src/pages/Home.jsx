import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Career from "../pages/Career";
import Contact from "../pages/Contact";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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