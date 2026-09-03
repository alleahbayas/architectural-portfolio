import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Career from "../pages/Career";
import Contact from "../pages/Contact";

function Home() {
  return (
    <div className="hero-frame">
      <Hero />
      <About />
      <Projects />
      <Career />
      <Contact />
    </div>
  );
}

export default Home;