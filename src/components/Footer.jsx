import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-content > *', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer-section" ref={footerRef}>
      <div className="footer-content">
        <div className="footer-logo">CITY CONSTRUCTIONS</div>
        <div className="footer-tagline">FROM VISION</div>
        <div className="footer-tagline">
          TO <span className="footer-tagline-accent">STRUCTURE.</span>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} City Constructions — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
