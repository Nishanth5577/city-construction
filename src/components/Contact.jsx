import React from 'react';
import { HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      {/* Subtle background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(200, 169, 126, 0.03) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      <div className="contact-content">
        <div className="contact-grid">
          <div>
            <div className="section-number">GET IN TOUCH</div>
            <h2 className="contact-heading">
              LET'S BUILD<br />SOMETHING GREAT.
            </h2>
            <div className="section-line" />
            <p className="section-text" style={{ marginBottom: '40px' }}>
              Every great project begins with a conversation. Tell us about your vision 
              and let's bring it to life together.
            </p>
          </div>

          <div>
            <div className="contact-company">CITY CONSTRUCTIONS</div>

            <div className="contact-director">
              <div className="contact-director-name">GANGADHARAN G</div>
              <div className="contact-director-title">Managing Director</div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <HiOutlinePhone />
              </div>
              <a href="tel:9943009988" className="contact-info-text">9943009988</a>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <HiOutlineEnvelope />
              </div>
              <a href="mailto:ergangakgm@gmail.com" className="contact-info-text">ergangakgm@gmail.com</a>
            </div>

            <div className="contact-buttons">
              <a href="tel:9943009988" className="btn-primary">
                CALL US
              </a>
              <a href="mailto:ergangakgm@gmail.com" className="btn-outline">
                SEND EMAIL
              </a>
              <a href="mailto:ergangakgm@gmail.com?subject=New%20Project%20Inquiry" className="btn-outline">
                START YOUR PROJECT
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
