import "./Contact.css";
import { useState, useEffect } from "react";
import { Phone, Mail, Download, Send } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import API_URL from "../api";

function Contact() {
  const [settings, setSettings] = useState({ resumeUrl: "", linkedinUrl: "" });

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  return (
    <section id="contact">
      <div className="contact-columns">
        <div className="contact-left">
          <p className="contact-label">
            <span className="contact-label-line"></span>
            GET IN TOUCH
          </p>
          <h1 className="contact-title">
            Let's<em> build</em> something
          </h1>

          <p className="contact-description">
            From the first concept to the finished space, I'm always open to
            thoughtful collaborations and new opportunities.
          </p>

          <div className="contact-info">
            <div className="contact-info-item">
              <Phone size={16} />
              <span>+63 917 192 0150</span>
            </div>
            <div className="contact-info-item">
              <Mail size={16} />
              <span>arch.gilliangutierrez@gmail.com</span>
            </div>
          </div>

          <div className="contact-buttons">
            {settings.linkedinUrl ? (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-linkedin"
              >
                <FaLinkedin size={16} />
                LinkedIn
              </a>
            ) : (
              <button className="btn-linkedin" disabled>
                <FaLinkedin size={16} />
                LinkedIn
              </button>
            )}

            {settings.resumeUrl ? (
              <a href={`${API_URL}/download-resume`} className="btn-cv">
                <Download size={16} />
                Download CV
              </a>
            ) : (
              <button className="btn-cv" disabled>
                <Download size={16} />
                Download CV
              </button>
            )}
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>NAME</label>
                <input type="text" placeholder="Alexander Brown" />
              </div>
              <div className="form-group">
                <label>EMAIL</label>
                <input type="email" placeholder="alexanderbrown@email.com" />
              </div>
            </div>

            <div className="form-group">
              <label>MESSAGE</label>
              <textarea
                rows="6"
                placeholder="Tell me a bit about what you have in mind..."
              ></textarea>
            </div>

            <button type="submit" className="btn-send">
              Send Message <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;