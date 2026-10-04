import React, { useRef, useEffect } from 'react';
import { HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      tl.from('.contact-left > *', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
        .from('.contact-right > *', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.6');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-left">
            <div className="section-number">GET IN TOUCH</div>
            <h2 className="contact-heading">
              LET'S BUILD<br />SOMETHING <span className="accent">GREAT.</span>
            </h2>
            <div className="section-line" />
            <p className="section-text" style={{ marginBottom: '40px' }}>
              Every great project begins with a conversation. Tell us about your vision 
              and let's bring it to life — from concept to completion.
            </p>
          </div>

          <div className="contact-right">
            <div className="contact-company">CITY CONSTRUCTIONS</div>

            <div className="contact-director">
              <div className="contact-director-name">GANGADHARAN G</div>
              <div className="contact-director-title">Managing Director</div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><HiOutlinePhone /></div>
              <a href="tel:9943009988" className="contact-info-text">9943009988</a>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><HiOutlineEnvelope /></div>
              <a href="mailto:ergangakgm@gmail.com" className="contact-info-text">ergangakgm@gmail.com</a>
            </div>

            <div className="contact-buttons">
              <a href="tel:9943009988" className="btn-primary"><span>CALL US</span></a>
              <a href="mailto:ergangakgm@gmail.com" className="btn-outline"><span>SEND EMAIL</span></a>
              <a href="mailto:ergangakgm@gmail.com?subject=New%20Project%20Inquiry" className="btn-outline"><span>START YOUR PROJECT</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
