import React, { useState, useEffect, useCallback } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      setScrolled(st > 80);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docH > 0 ? (st / docH) * 100 : 0);

      // Determine active section
      const sections = ['home', 'about', 'services', 'projects', 'studio', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  }, []);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'studio', label: '3D Studio' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="nav-progress" style={{ width: `${scrollPercent}%` }} />

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
          <span className="nav-logo-city">CITY</span>
          <span className="nav-logo-constructions">CONSTRUCTIONS</span>
        </div>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.id}>
              <a
                className={activeSection === link.id ? 'active' : ''}
                onClick={() => scrollTo(link.id)}
                style={{ cursor: 'pointer' }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className={`mobile-menu-btn ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <a key={link.id} onClick={() => scrollTo(link.id)} style={{ cursor: 'pointer' }}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
