import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";

function Home() {
  return (
    <div className="hero-frame">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  );
}

export default Home;