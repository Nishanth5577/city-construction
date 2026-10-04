import React, { useRef, useEffect, useState } from 'react';
import { stats } from '../data/projects';

const whyItems = [
  { label: 'QUALITY', text: 'Precision from planning to completion.' },
  { label: 'TRANSPARENCY', text: 'Clear communication throughout the project.' },
  { label: 'ENGINEERING', text: 'Strong technical foundations behind every structure.' },
  { label: 'DESIGN', text: 'Modern architectural thinking combined with practical execution.' },
  { label: 'RELIABILITY', text: 'Construction focused on long-term value.' },
];

function AnimatedNumber({ value, suffix, inView }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, value]);

  return (
    <span>
      {display}<span className="stat-suffix">{suffix}</span>
    </span>
  );
}

export default function WhyUsAndStats() {
  const whyRef = useRef(null);
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    // Why items observer
    const whyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = whyRef.current?.querySelectorAll('.why-item');
    items?.forEach((item) => whyObserver.observe(item));

    // Stats observer
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      whyObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Why City Constructions */}
      <section className="section why-section" id="why" ref={whyRef}>
        <div className="section-number">WHY CHOOSE US</div>
        <h2 className="section-heading">WHY CITY CONSTRUCTIONS</h2>
        <div className="section-line" />

        <div className="why-grid">
          {whyItems.map((item, i) => (
            <div
              className="why-item"
              key={item.label}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="why-label">{item.label}</div>
              <div className="why-text">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-value">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={statsInView} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
