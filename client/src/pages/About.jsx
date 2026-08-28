import "./About.css";
import Profile from "../assets/profile.jpg";
import { LocateFixed, Building2, GraduationCap, Globe } from "lucide-react";

function About() {
  return (
    <section id="about">
      <div className="about-grid">
        <img src={Profile} alt="profile" className="about-img">
        </img>

        <div>
          <p className="about-label">
            <span className="about-label-line">
              </span>BEYOND THE VISION</p>
          <h2 className="about-title">
            Ar. Gillian Gutierrez</h2>
          <p className="about-description">
            Ms. Gutierrez is a Licensed Architect with a diverse professional 
            background spanning residential, commercial, and retail design. 
            Her expertise extends beyond the drafting table into the technical 
            complexities of construction management, civil works, and the fine 
            details of bespoke furniture design.</p>
        </div>

        <div className="about-box-wrapper">
          <div className="about-box">
            <h3 className="about-box-title">More 
              <em> about</em> me</h3>

            <div className="about-info-row">
              <div className="about-info-label">
                <LocateFixed size={16} />
                <span>ADDRESS</span>
              </div>
              <div className="about-info-value">
                <p>Amadeo, Cavite</p>
              </div>              
            </div>

            <div className="about-info-row">
              <div className="about-info-label">
                <Building2 size={16} />
                <span>UNIVERSITY</span>
              </div>
              <div className="about-info-value">
                <p>De La Salle University Dasmariñas</p>
                <span className="about-info-desc">(2013-2019)</span>
              </div>              
            </div>

            <div className="about-info-row">
              <div className="about-info-label">
                <GraduationCap size={16} />
                <span>EDUCATION</span>
              </div>
              <div className="about-info-value">
                <p>BS Architecture</p>
              </div>              
            </div>
            
            <div className="about-info-row">
              <div className="about-info-label">
                <Globe size={16} />
                <span>LANGUAGES</span>
              </div>
              <div className="about-info-value">
                <p>English</p>
                <span className="about-info-desc">Advanced</span>
                <p style={{ marginTop: "12px" }}>Filipino</p>
                <span className="about-info-desc">Native</span>
              </div>              
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;