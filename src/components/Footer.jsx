import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">CITY CONSTRUCTIONS</div>
        <div className="footer-tagline">
          FROM VISION
        </div>
        <div className="footer-tagline">
          TO <span className="footer-tagline-accent">STRUCTURE.</span>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} City Constructions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
