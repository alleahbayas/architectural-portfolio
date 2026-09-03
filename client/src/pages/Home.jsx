import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Career from "../pages/Career";
import Contact from "../pages/Contact";
import Footer from "../components/Footer";

function Home() {
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