import "./Contact.css";
import { Phone, Mail, Download, Send } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

function Contact() {
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
            <button className="btn-linkedin">
              <FaLinkedin size={16} />
              LinkedIn
            </button>
            <button className="btn-cv">
              <Download size={16} />
              Download CV
            </button>
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