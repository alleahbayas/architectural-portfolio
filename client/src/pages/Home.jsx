import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";

function Home() {
  return (
    <div className="hero-frame">
      <Hero />
      <section id="about"><About /></section>
      <section id="projects"><Projects /></section>
      <section id="contact"><Contact /></section>
    </div>
  );
}

export default Home;